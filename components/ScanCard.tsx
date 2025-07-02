import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ScanCardProps {
  onPress: () => void;
}

const ScanCard: React.FC<ScanCardProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.title}>Scan Product</Text>
        <Text style={styles.subtitle}>Tap to scan for allergens</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%", // This makes it stretch to full width
    backgroundColor: "#e6f3ff",
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    // Remove any maxWidth or fixed width constraints
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
  },
});

export default ScanCard;
