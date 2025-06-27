import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDLwFscVAixGxKK3vmclZRqdVG4oC0uEgA",
  authDomain: "allergyapp-d03a5.firebaseapp.com",
  projectId: "allergyapp-d03a5",
  storageBucket: "allergyapp-d03a5.firebasestorage.app",
  messagingSenderId: "348964567112",
  appId: "1:348964567112:web:1e8e506356b4bb84c5c07d",
  measurementId: "G-2MVY62QK0D"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Use correct auth initialization based on platform
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app); // Use standard web auth
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { auth };

export const db = getFirestore(app);
export const storage = getStorage(app);
export const usersRef = collection(db, 'users');


