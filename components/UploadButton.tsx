import React from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

type Props = {
  onPress: (event: GestureResponderEvent) => void;
  label?: string;
};

export default function UploadButton({
  onPress,
  label = "Upload Image",
}: Props) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
