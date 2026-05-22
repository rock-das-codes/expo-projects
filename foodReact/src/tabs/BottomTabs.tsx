import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
// 1. Import your icon library (adjust package name if using Expo)
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from '../screens/tabScreen/Home';
import Search from '../screens/tabScreen/Search';
import Order from '../screens/tabScreen/Order';
import Profile from '../screens/tabScreen/Profile';

const Tab = createBottomTabNavigator();

const BottomTabs = React.memo(() => {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false, // Prevents double headers if nesting inside a Stack
        tabBarIcon: ({ focused, color, size }) => {
          let icon;
          
          // 2. Fixed cleaner lookup pattern instead of the broken nested ternary
          if (route.name === "Home") icon = focused ? "home" : "home-outline";
          else if (route.name === "Search") icon = focused ? "search" : "search-outline";
          else if (route.name === "Order") icon = focused ? "cart" : "cart-outline";
          else if (route.name === "Profile") icon = focused ? "person" : "person-outline";
          else icon = "alert-circle-outline"; // Safe fallback

          return <Ionicons name={icon} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Order" component={Order} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
});

BottomTabs.displayName = 'BottomTabs';

export default BottomTabs;