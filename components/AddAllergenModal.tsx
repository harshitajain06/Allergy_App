import React, { useState } from "react";
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

interface NewAllergen {
  name: string;
  severity: "mild" | "moderate" | "severe";
  comments: string;
}

interface AddAllergenModalProps {
  visible: boolean;
  newAllergen: NewAllergen;
  onClose: () => void;
  onSave: () => Promise<void>; // Changed to async
  onUpdateAllergen: (allergen: NewAllergen) => void;
}

const AddAllergenModal: React.FC<AddAllergenModalProps> = ({
  visible,
  newAllergen,
  onClose,
  onSave,
  onUpdateAllergen,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!newAllergen.name.trim()) {
      Alert.alert("Error", "Please enter an allergen name");
      return;
    }

    setIsSaving(true);
    try {
      await onSave();
    } catch (error) {
      console.error("Error saving allergen:", error);
      Alert.alert("Error", "Failed to save allergen. Please try again.");
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
          <Text style={styles.modalTitle}>Add New Allergen</Text>

          {/* Allergen Name Input */}
          <Text style={styles.inputLabel}>Allergen Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Peanuts, Shellfish, Dairy"
            value={newAllergen.name}
            onChangeText={(text) =>
              onUpdateAllergen({ ...newAllergen, name: text })
            }
            editable={!isSaving}
          />

          {/* Severity Level */}
          <Text style={styles.inputLabel}>Severity Level</Text>
          <View style={styles.severityButtons}>
            {["mild", "moderate", "severe"].map((severity) => (
              <TouchableOpacity
                key={severity}
                style={[
                  styles.severityButton,
                  newAllergen.severity === severity &&
                    styles.selectedSeverityButton,
                ]}
                onPress={() =>
                  onUpdateAllergen({
                    ...newAllergen,
                    severity: severity as "mild" | "moderate" | "severe",
                  })
                }
                disabled={isSaving}
              >
                <Text
                  style={[
                    styles.severityButtonText,
                    newAllergen.severity === severity &&
                      styles.selectedSeverityButtonText,
                  ]}
                >
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Comments & Notes */}
          <Text style={styles.inputLabel}>Comments & Notes</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe your symptoms, triggers, or any additional notes..."
            multiline
            numberOfLines={4}
            value={newAllergen.comments}
            onChangeText={(text) =>
              onUpdateAllergen({ ...newAllergen, comments: text })
            }
            editable={!isSaving}
          />

          {/* Modal Buttons */}
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
              style={[
                styles.addAllergenButton,
                isSaving && styles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.addAllergenButtonText}>Add Allergen</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  inputLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },
  severityButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  severityButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 4,
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  selectedSeverityButton: {
    borderColor: "#3B82F6",
    backgroundColor: "#DBEAFE",
  },
  severityButtonText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
  selectedSeverityButtonText: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
    height: 120,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
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
  addAllergenButton: {
    flex: 1,
    paddingVertical: 16,
    marginLeft: 8,
    alignItems: "center",
    backgroundColor: "#3B82F6",
    borderRadius: 12,
  },
  addAllergenButtonText: {
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

export default AddAllergenModal;
