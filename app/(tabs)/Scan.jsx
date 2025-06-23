
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Scan() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Page</Text>
      <Text>Recommend allergy-friendly diet here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
