import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AppTabs() {
  const insets = useSafeAreaInsets();

  // Bottom padding calculations matching theme constants
  const bottomInset = Platform.OS === 'web' ? 16 : Math.max(insets.bottom, 12);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        // Hide default React Navigation tab bar so we can draw our custom one
        tabBarStyle: { display: 'none' },
      }}
      tabBar={({ state, descriptors, navigation }) => {
        return (
          <View style={[styles.tabBarContainer, { paddingBottom: bottomInset }]}>
            {state.routes.map((route, index) => {
              // Ensure we only render the main tab routes
              if (!['index', 'activity', 'history', 'safety'].includes(route.name)) {
                return null;
              }

              const isFocused = state.index === index;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              };

              let iconName: string = 'grid';
              let tabLabel = '';

              switch (route.name) {
                case 'index':
                  iconName = isFocused ? 'grid' : 'grid-outline';
                  tabLabel = 'Dashboard';
                  break;
                case 'activity':
                  iconName = isFocused ? 'speedometer' : 'speedometer-outline';
                  tabLabel = 'Activity';
                  break;
                case 'history':
                  iconName = isFocused ? 'time' : 'time-outline';
                  tabLabel = 'History';
                  break;
                case 'safety':
                  iconName = isFocused ? 'shield-checkmark' : 'shield-checkmark-outline';
                  tabLabel = 'Safety';
                  break;
              }

              return (
                <TouchableOpacity
                  key={route.key}
                  activeOpacity={0.7}
                  onPress={onPress}
                  style={styles.tabItem}
                >
                  {/* Selected blue capsule/pill wrapper around the icon */}
                  <View
                    style={[
                      styles.iconWrapper,
                      isFocused ? styles.iconWrapperActive : null,
                    ]}
                  >
                    <Ionicons
                      name={iconName as any}
                      size={20}
                      color={isFocused ? '#5da5ff' : '#8b8f97'}
                    />
                  </View>
                  <Text
                    style={[
                      styles.tabLabelText,
                      isFocused ? styles.tabLabelTextActive : styles.tabLabelTextInactive,
                    ]}
                  >
                    {tabLabel}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="safety" options={{ title: 'Safety' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#0c0d0e',
    borderTopWidth: 1,
    borderTopColor: '#1e2025',
    paddingTop: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 100,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 64,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconWrapperActive: {
    backgroundColor: 'rgba(93, 165, 255, 0.15)', // light blue active badge overlay
  },
  tabLabelText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tabLabelTextActive: {
    color: '#5da5ff',
  },
  tabLabelTextInactive: {
    color: '#8b8f97',
  },
});
