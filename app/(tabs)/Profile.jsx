import AccountSettings from '@/components/AccountSettings';
import AllergenManager from '@/components/AllergenManager';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function Profile() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <AllergenManager />
        <AccountSettings />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40, // Extra padding at bottom for scroll
  },
});