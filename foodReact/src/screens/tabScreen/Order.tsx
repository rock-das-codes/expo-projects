//make a order page
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useMemo } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

const Order = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>()

  const orders = useMemo(() => [
    { id: '1', restaurant: 'Pizza Palace', total: 45.99, date: '2 days ago', status: 'Delivered' },
    { id: '2', restaurant: 'Burger Barn', total: 32.50, date: '5 days ago', status: 'Delivered' },
    { id: '3', restaurant: 'Sushi Supreme', total: 78.00, date: '1 week ago', status: 'Delivered' },
  ], [])

  const handleNavigateHome = () => {
    // Using goBack to return to previous screen
    navigation.goBack()
  }

  const handleReorder = (restaurantId: string) => {
    // Using navigate with params
    navigation.navigate('Home', { 
      screen: 'RestaurantDetail',
      params: {
        restaurantId,
        restaurantName: 'Restaurant',
        restaurantPrice: '2.99'
      }
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Orders</Text>
        </View>

        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color="#ddd" />
            <Text style={styles.emptyText}>No orders yet</Text>
            <TouchableOpacity 
              style={styles.shopButton}
              onPress={handleNavigateHome}
            >
              <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.ordersContainer}>
            {orders.map(order => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderInfo}>
                  <Text style={styles.restaurantName}>{order.restaurant}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                  <View style={styles.statusRow}>
                    <View style={[styles.statusBadge, { backgroundColor: '#e8f5e9' }]}>
                      <Ionicons name="checkmark-circle" size={14} color="#4caf50" />
                      <Text style={[styles.statusText, { color: '#4caf50' }]}>{order.status}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.orderActions}>
                  <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
                  <TouchableOpacity 
                    style={styles.reorderButton}
                    onPress={() => handleReorder(order.id)}
                  >
                    <Text style={styles.reorderButtonText}>Reorder</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  shopButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#FFD700',
    borderRadius: 8,
  },
  shopButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  ordersContainer: {
    padding: 16,
  },
  orderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  orderInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  orderActions: {
    alignItems: 'flex-end',
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  reorderButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFD700',
    borderRadius: 6,
  },
  reorderButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
})

export default React.memo(Order)