import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCart } from '../../context/CartContext';

interface RouteParams {
  restaurantId: string;
  restaurantName: string;
  restaurantPrice: string;
}

const RestaurantDetail = () => {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { addToCart } = useCart();

  const params = route.params as RouteParams;

  const mockMenuItems = useMemo(() => [
    { id: '1', name: 'Burger', price: 12.99 },
    { id: '2', name: 'Pizza', price: 15.99 },
    { id: '3', name: 'Pasta', price: 13.99 },
    { id: '4', name: 'Salad', price: 9.99 },
  ], []);

  const handleAddToCart = (item: typeof mockMenuItems[0]) => {
    addToCart({
      id: `${params.restaurantId}-${item.id}`,
      restaurantId: params.restaurantId,
      restaurantName: params.restaurantName,
      name: item.name,
      price: item.price,
      quantity: 1,
    });
    
    // Show feedback
    alert(`${item.name} added to cart!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{params.restaurantName}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: 'https://via.placeholder.com/400x200' }}
          style={styles.restaurantImage}
        />

        <View style={styles.info}>
          <Text style={styles.restaurantName}>{params.restaurantName}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>4.5 (320 reviews)</Text>
            <Text style={styles.deliveryTime}>• 30-45 min</Text>
          </View>
          <Text style={styles.deliveryFee}>Delivery: ${params.restaurantPrice}</Text>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Menu</Text>
          {mockMenuItems.map(item => (
            <View key={item.id} style={styles.menuItem}>
              <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddToCart(item)}
              >
                <Ionicons name="add-circle" size={28} color="#FFD700" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => navigation.navigate('Cart', { restaurantName: params.restaurantName })}
      >
        <Ionicons name="cart" size={20} color="#000" style={{ marginRight: 8 }} />
        <Text style={styles.cartButtonText}>View Cart</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#FFD700',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
  },
  info: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  deliveryTime: {
    fontSize: 14,
    color: '#666',
  },
  deliveryFee: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  menuSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  addButton: {
    marginLeft: 8,
  },
  cartButton: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
  },
  cartButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default React.memo(RestaurantDetail);
