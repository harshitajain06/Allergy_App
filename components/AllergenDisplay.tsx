import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAllergens } from "./AllergenContext";

interface AllergenDisplayProps {
  onManagePress?: () => void;
}

const AllergenDisplay: React.FC<AllergenDisplayProps> = ({ onManagePress }) => {
  const { allergens, loading, error } = useAllergens();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "#FFE5E5";
      case "moderate":
        return "#FFF4E5";
      case "mild":
        return "#FFF9E5";
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
        return "#DAA520";
      default:
        return "#8B5CF6";
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Allergens</Text>
          <TouchableOpacity onPress={onManagePress} disabled>
            <Text style={styles.manageButton}>Manage</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Allergens</Text>
          <TouchableOpacity onPress={onManagePress}>
            <Text style={styles.manageButton}>Manage</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Allergens</Text>
        <TouchableOpacity onPress={onManagePress}>
          <Text style={styles.manageButton}>Manage</Text>
        </TouchableOpacity>
      </View>

      {/* Allergen List */}
      {allergens.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No allergens added yet</Text>
        </View>
      ) : (
        <View style={styles.allergenListContainer}>
          {allergens.length <= 4 ? (
            <View style={styles.allergenList}>
              {allergens.map((allergen) => (
                <View /*key={allergen.id}*/ style={styles.allergenItem}>
                  <Text style={styles.allergenName}>{allergen.name}</Text>
                  <View
                    style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(allergen.severity) },
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
                  <Text style={styles.allergenName}>{allergen.name}</Text>
                  <View
                    style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(allergen.severity) },
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
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}
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
  manageButton: {
    color: "#8B5CF6",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
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
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  allergenList: {
    // Container for allergen items
  },
  scrollableList: {
    maxHeight: 250,
  },
  allergenItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  allergenName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
  },
  severityText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default AllergenDisplay;
