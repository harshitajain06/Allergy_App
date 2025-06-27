import { AllergenProvider } from '@/components/AllergenContext'; // Add this import
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { signOut } from 'firebase/auth';
import React from 'react';
import { Alert } from 'react-native';
import { auth } from '../../config/firebase';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import ForumPage from './Forum';
import HistoryPage from './History';
import HomePage from './Home';
import ProfilePage from './Profile';
import ScanPage from './Scan';
import LoginRegister from './index';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Bottom Tab Navigator Component
const BottomTabs = () => {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Forum') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Scan') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          }else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Forum" component={ForumPage} />
      <Tab.Screen name="Scan" component={ScanPage} />
      <Tab.Screen name="History" component={HistoryPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
};

// Drawer Navigator Component
const DrawerNavigator = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            signOut(auth)
              .then(() => {
                navigation.replace('index');
              })
              .catch((err) => {
                console.error('Logout Error:', err);
                Alert.alert('Error', 'Failed to logout. Please try again.');
              });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Drawer.Navigator initialRouteName="MainTabs">
      <Drawer.Screen name="MainTabs" component={BottomTabs} options={{ title: 'Home' }} />
      
      <Drawer.Screen
        name="Logout"
        component={BottomTabs}
        options={{
          title: 'Logout',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
        listeners={{
          drawerItemPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        }}
      />
    </Drawer.Navigator>
  );
};

// Stack Navigator Component
export default function StackLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
      }}
    >
      {/* Authentication Screens */}
      <Stack.Screen name="LoginRegister" component={LoginRegister} />

      {/* Main App with Drawer - Wrapped with AllergenProvider */}
      <Stack.Screen name="Drawer">
        {() => (
          <AllergenProvider>
            <DrawerNavigator />
          </AllergenProvider>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}