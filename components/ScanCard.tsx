import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
type Props = {
  onPress: () => void;
};

export default function ScanCard({ onPress }: Props) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <MaterialIcons
        name="camera-alt"
        size={36}
        color="#007bff"
        style={styles.icon}
      />
      <Text style={styles.title}>Scan Food for Allergens</Text>
      <Text style={styles.subtitle}>Tap to start scanning</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#e6f3ff",
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 80,
    alignItems: "center",
    marginVertical: 20,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007bff",
  },
  subtitle: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 4,
  },
});
