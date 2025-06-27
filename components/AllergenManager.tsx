import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddAllergenModal from "./AddAllergenModal";
import { useAllergens } from "./AllergenContext";

interface NewAllergen {
  name: string;
  severity: "mild" | "moderate" | "severe";
  comments: string;
}

const AllergenManager = () => {
  const { allergens, addAllergen, removeAllergen } = useAllergens();

  const [modalVisible, setModalVisible] = useState(false);
  const [newAllergen, setNewAllergen] = useState<NewAllergen>({
    name: "",
    severity: "mild",
    comments: "",
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "#FFE5E5";
      case "moderate":
        return "#FFF4E5";
      case "mild":
        return "#F0E5FF";
      default:
        return "#F0E5FF";
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "#CC0000";
      case "moderate":
        return "#FF8C00";
      case "mild":
        return "#8B5CF6";
      default:
        return "#8B5CF6";
    }
  };

  const handleAddAllergen = () => {
    if (newAllergen.name.trim()) {
      addAllergen({
        name: newAllergen.name,
        severity: newAllergen.severity,
        comments: newAllergen.comments,
      });
      setNewAllergen({ name: "", severity: "mild", comments: "" });
      setModalVisible(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `Added ${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setNewAllergen({ name: "", severity: "mild", comments: "" });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Allergens</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Allergen List or Empty State */}
      {allergens.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Hit add to start tracking your allergens!
          </Text>
        </View>
      ) : (
        <View style={styles.allergenListContainer}>
          {allergens.length <= 3 ? (
            <View style={styles.allergenList}>
              {allergens.map((allergen) => (
                <View /*key={allergen.id}*/ style={styles.allergenItem}>
                  <View style={styles.allergenContent}>
                    <View style={styles.allergenInfo}>
                      <Text style={styles.allergenName}>{allergen.name}</Text>
                      <Text style={styles.allergenComments}>
                        {allergen.comments}
                      </Text>
                      <Text style={styles.allergenDate}>
                        {formatDate(allergen.dateAdded)}
                      </Text>
                    </View>
                    <View style={styles.allergenActions}>
                      <View
                        style={[
                          styles.severityBadge,
                          {
                            backgroundColor: getSeverityColor(
                              allergen.severity
                            ),
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.severityText,
                            { color: getSeverityTextColor(allergen.severity) },
                          ]}
                        >
                          {allergen.severity}
                        </Text>
                        <TouchableOpacity
                          onPress={() => removeAllergen(allergen.id)}
                          style={styles.removeButton}
                        >
                          <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <ScrollView
              style={[styles.allergenList, styles.scrollableList]}
              showsVerticalScrollIndicator={false}
            >
              {allergens.map((allergen) => (
                <View /*key={allergen.id}*/ style={styles.allergenItem}>
                  <View style={styles.allergenContent}>
                    <View style={styles.allergenInfo}>
                      <Text style={styles.allergenName}>{allergen.name}</Text>
                      <Text style={styles.allergenComments}>
                        {allergen.comments}
                      </Text>
                      <Text style={styles.allergenDate}>
                        {formatDate(allergen.dateAdded)}
                      </Text>
                    </View>
                    <View style={styles.allergenActions}>
                      <View
                        style={[
                          styles.severityBadge,
                          {
                            backgroundColor: getSeverityColor(
                              allergen.severity
                            ),
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.severityText,
                            { color: getSeverityTextColor(allergen.severity) },
                          ]}
                        >
                          {allergen.severity}
                        </Text>
                        <TouchableOpacity
                          onPress={() => removeAllergen(allergen.id)}
                          style={styles.removeButton}
                        >
                          <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* Add Allergen Modal */}
      <AddAllergenModal
        visible={modalVisible}
        newAllergen={newAllergen}
        onClose={handleCloseModal}
        onSave={handleAddAllergen}
        onUpdateAllergen={setNewAllergen}
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
  addButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginLeft: 20,
  },
  addButtonText: {
    color: "#8B5CF6",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999999",
    textAlign: "center",
    fontStyle: "italic",
  },
  allergenListContainer: {
    // Container that will grow with content
  },
  allergenList: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  scrollableList: {
    maxHeight: 300,
  },
  allergenItem: {
    backgroundColor: "#FFFFFF",
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  allergenContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
  },
  allergenInfo: {
    flex: 1,
    marginRight: 12,
  },
  allergenName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  allergenComments: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
    lineHeight: 20,
  },
  allergenDate: {
    fontSize: 12,
    color: "#999999",
  },
  allergenActions: {
    alignItems: "flex-end",
  },
  severityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  severityText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  removeButton: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666666",
  },
});

export default AllergenManager;
