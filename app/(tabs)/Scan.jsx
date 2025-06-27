import UploadButton from '@/components/UploadButton';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Scan() {
   const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
    } else {
      alert('You did not select any image.');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Page</Text>
      <Text>Recommend allergy-friendly diet here.</Text>
      <UploadButton label="Pick Image" onPress={pickImageAsync} />
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
