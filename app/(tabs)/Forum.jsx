
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Forum() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forum Page</Text>
      <Text>Display natural remedies or treatment tips.</Text>
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
