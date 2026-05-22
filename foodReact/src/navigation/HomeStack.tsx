import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/tabScreen/Home';
import RestaurantDetail from '../screens/tabScreen/RestaurantDetail';
import Cart from '../screens/tabScreen/Cart';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen 
        name="RestaurantDetail" 
        component={RestaurantDetail}
        options={{
          animationEnabled: true,
          animationTypeForReplace: 'pop',
        }}
      />
      <Stack.Screen 
        name="Cart" 
        component={Cart}
        options={{
          animationEnabled: true,
          animationTypeForReplace: 'pop',
        }}
      />
    </Stack.Navigator>
  );
};

export default React.memo(HomeStack);
