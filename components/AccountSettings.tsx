import { onAuthStateChanged, updateEmail, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../config/firebase"; // Adjust path as needed

interface UserData {
  name: string;
  email: string;
  createdAt: string;
}

interface EditModalProps {
  visible: boolean;
  title: string;
  value: string;
  onClose: () => void;
  onSave: (newValue: string) => Promise<void>;
  placeholder: string;
  keyboardType?: "default" | "email-address";
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  title,
  value,
  onClose,
  onSave,
  placeholder,
  keyboardType = "default",
}) => {
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditValue(value);
  }, [value, visible]);

  const handleSave = async () => {
    if (!editValue.trim()) {
      Alert.alert("Error", `Please enter a valid ${title.toLowerCase()}`);
      return;
    }

    if (editValue.trim() === value.trim()) {
      onClose();
      return;
    }

    setIsSaving(true);
    try {
      await onSave(editValue.trim());
      onClose();
    } catch (error) {
      console.error(`Error updating ${title.toLowerCase()}:`, error);
      Alert.alert(
        "Error",
        `Failed to update ${title.toLowerCase()}. Please try again.`
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit {title}</Text>

          <TextInput
            style={styles.editInput}
            value={editValue}
            onChangeText={setEditValue}
            placeholder={placeholder}
            keyboardType={keyboardType}
            autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
            editable={!isSaving}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.cancelButton, isSaving && styles.disabledButton]}
              onPress={onClose}
              disabled={isSaving}
            >
              <Text
                style={[
                  styles.cancelButtonText,
                  isSaving && styles.disabledText,
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.disabledButton]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const AccountSettings = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<"name" | "email">("name");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setLoading(true);
          setError(null);

          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));

          if (userDoc.exists()) {
            const firestoreData = userDoc.data();
            setUserData({
              name: firestoreData.name || user.displayName || "No name",
              email: user.email || "No email",
              createdAt: firestoreData.createdAt || "Unknown",
            });
          } else {
            // Fallback to auth data if Firestore doc doesn't exist
            setUserData({
              name: user.displayName || "No name",
              email: user.email || "No email",
              createdAt: user.metadata.creationTime || "Unknown",
            });
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to load user data");
        } finally {
          setLoading(false);
        }
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const handleEditName = async (newName: string) => {
    if (!auth.currentUser) throw new Error("No authenticated user");

    // Update Firebase Auth profile
    await updateProfile(auth.currentUser, { displayName: newName });

    // Update Firestore document
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      name: newName,
    });

    // Update local state
    setUserData((prev) => (prev ? { ...prev, name: newName } : null));
    Alert.alert("Success", "Name updated successfully!");
  };

  const handleEditEmail = async (newEmail: string) => {
    if (!auth.currentUser) throw new Error("No authenticated user");

    // Update Firebase Auth email
    await updateEmail(auth.currentUser, newEmail);

    // Update Firestore document
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      email: newEmail,
    });

    // Update local state
    setUserData((prev) => (prev ? { ...prev, email: newEmail } : null));
    Alert.alert("Success", "Email updated successfully!");
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `Member since ${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    } catch (err) {
      return "Member since unknown date";
    }
  };

  const openEditModal = (field: "name" | "email") => {
    setEditField(field);
    setEditModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account Settings</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading account data...</Text>
        </View>
      </View>
    );
  }

  if (error || !userData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account Settings</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || "Failed to load account data"}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account Settings</Text>
      </View>

      {/* User Data */}
      <View style={styles.settingsContainer}>
        {/* Name Field */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Name</Text>
            <Text style={styles.settingValue}>{userData.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => openEditModal("name")}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Email Field */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Email</Text>
            <Text style={styles.settingValue}>{userData.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => openEditModal("email")}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Created Date */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDate(userData.createdAt)}</Text>
        </View>
      </View>

      {/* Edit Modal */}
      <EditModal
        visible={editModalVisible}
        title={editField === "name" ? "Name" : "Email"}
        value={editField === "name" ? userData.name : userData.email}
        onClose={() => setEditModalVisible(false)}
        onSave={editField === "name" ? handleEditName : handleEditEmail}
        placeholder={
          editField === "name" ? "Enter your name" : "Enter your email"
        }
        keyboardType={editField === "email" ? "email-address" : "default"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginTop: 20,
  },
  header: {
    backgroundColor: "#E5D9FF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
  },
  loadingContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666666",
  },
  errorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#CC0000",
    textAlign: "center",
  },
  settingsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 14,
    color: "#666666",
  },
  editButton: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  dateContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  dateText: {
    fontSize: 14,
    color: "#999999",
    fontStyle: "italic",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 24,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    marginRight: 8,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#8B5CF6",
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    marginLeft: 8,
    alignItems: "center",
    backgroundColor: "#3B82F6",
    borderRadius: 12,
  },
  saveButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.6,
  },
});

export default AccountSettings;
