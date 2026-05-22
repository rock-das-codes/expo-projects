import * as React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnBoardingNavigation from './src/onboardings/onBoardingNavigation';
import BottomTabs from './src/tabs/BottomTabs';
import Login from './src/screens/auth/Login';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';

const Stack = createNativeStackNavigator();

const linking: LinkingOptions<any> = {
  prefixes: ['foodapp://', 'http://', 'https://'],
  config: {
    screens: {
      BottomTabs: {
        screens: {
          Home: {
            screens: {
              RestaurantDetail: 'restaurant/:restaurantId',
              Cart: 'cart',
            },
          },
        },
      },
    },
  },
};

const RootNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{
            animationEnabled: false,
          } as any}
        />
      ) : (
        <>
          <Stack.Screen 
            name="OnBoarding" 
            component={OnBoardingNavigation}
            options={{
              animationEnabled: true,
            } as any}
          />
          <Stack.Screen 
            name="BottomTabs" 
            component={BottomTabs}
            options={{
              animationEnabled: true,
            } as any}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  
  React.useEffect(() => {
    // Auth state is automatically handled by context
  }, [isAuthenticated]);

  return (
    <NavigationContainer linking={linking} fallback={null}>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}