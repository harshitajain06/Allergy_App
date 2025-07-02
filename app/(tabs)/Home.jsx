import AllergenDisplay from '@/components/AllergenDisplay';
import ScanCard from '@/components/ScanCard';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { auth, db } from '../../config/firebase'; // Adjust path as needed

export default function Home({ navigation }) {
  const [userName, setUserName] = useState('there'); // Default fallback

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // First try to get name from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          let fullName = '';
          if (userDoc.exists()) {
            fullName = userDoc.data().name || '';
          }
          
          // Fallback to Firebase Auth displayName if Firestore doesn't have it
          if (!fullName && user.displayName) {
            fullName = user.displayName;
          }
          
          // Extract first name (everything before the first space)
          if (fullName) {
            const firstName = fullName.split(' ')[0];
            setUserName(firstName);
          } else {
            setUserName('there'); // Fallback if no name is available
          }
        } catch (error) {
          console.error('Error fetching user name:', error);
          setUserName('there'); // Fallback on error
        }
      } else {
        setUserName('there'); // User not authenticated
      }
    });

    return unsubscribe;
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Hey {userName}!</Text>
        
        <View style={styles.componentContainer}>
          <ScanCard onPress={() => navigation.navigate("Scan")} />
        </View>
        
        <AllergenDisplay onManagePress={() => navigation.navigate("Profile")} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  componentContainer: {
    width: '100%',
    marginBottom: 20,
  },
});