//profile page
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { useMemo } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useAuth } from '../../context/AuthContext'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

const Profile = () => {
  const { user, logout } = useAuth()
  const navigation = useNavigation<NativeStackNavigationProp<any>>()

  const handleLogout = () => {
    // Using replace to prevent going back
    logout()
    navigation.replace('Login')
  }

  const menuItems = useMemo(() => [
    { id: '1', icon: 'receipt', label: 'My Orders', onPress: () => alert('Navigate to Orders') },
    { id: '2', icon: 'settings', label: 'Settings', onPress: () => alert('Navigate to Settings') },
    { id: '3', icon: 'help-circle', label: 'Help & Support', onPress: () => alert('Navigate to Help') },
    { id: '4', icon: 'heart', label: 'Favorites', onPress: () => alert('Navigate to Favorites') },
  ], [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <Image
            source={{ uri: user?.avatar || 'https://i.pravatar.cc/150?img=1' }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <Ionicons name={item.icon as any} size={20} color="#FFD700" style={{ marginRight: 12 }} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#ddd" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ff6b6b" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff9e6',
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
  },
  menuSection: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    backgroundColor: '#fff5f5',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff6b6b',
  },
})

export default React.memo(Profile)