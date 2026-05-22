import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useMemo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeStack from '../navigation/HomeStack';
import Search from '../screens/tabScreen/Search';
import Order from '../screens/tabScreen/Order';
import Profile from '../screens/tabScreen/Profile';
import { useCart } from '../context/CartContext';
import { useRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const BottomTabs = React.memo(() => {
  const { items } = useCart();
  const cartCount = useMemo(() => items.length, [items]);

  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let icon;
          
          if (route.name === "Home") icon = focused ? "home" : "home-outline";
          else if (route.name === "Search") icon = focused ? "search" : "search-outline";
          else if (route.name === "Order") icon = focused ? "cart" : "cart-outline";
          else if (route.name === "Profile") icon = focused ? "person" : "person-outline";
          else icon = "alert-circle-outline";

          return <Ionicons name={icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#eee',
          paddingBottom: 4,
          paddingTop: 4,
          height: 56,
          backgroundColor: '#fff',
        },
        animationEnabled: true,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={Search}
        options={{
          tabBarLabel: 'Search',
        }}
      />
      <Tab.Screen 
        name="Order" 
        component={Order}
        options={{
          tabBarLabel: 'Orders',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
});

BottomTabs.displayName = 'BottomTabs';

export default BottomTabs;