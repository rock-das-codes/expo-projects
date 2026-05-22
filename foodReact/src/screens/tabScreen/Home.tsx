import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from "react-native";
import React, { useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Ionicons from '@expo/vector-icons/Ionicons';

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const restaurants = useMemo(() => [
    { id: '1', name: 'Pizza Palace', price: '2.99', rating: 4.5, reviews: 120 },
    { id: '2', name: 'Burger Barn', price: '1.99', rating: 4.8, reviews: 340 },
    { id: '3', name: 'Sushi Supreme', price: '3.99', rating: 4.6, reviews: 210 },
    { id: '4', name: 'Pasta Paradise', price: '2.49', rating: 4.4, reviews: 180 },
  ], []);

  const handleNavigateToRestaurant = (restaurantId: string, restaurantName: string, price: string) => {
    // Using navigate with params
    navigation.navigate('RestaurantDetail', {
      restaurantId,
      restaurantName,
      restaurantPrice: price,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good to see you!</Text>
        <Ionicons name="notifications-outline" size={24} color="#000" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" style={{ marginRight: 8 }} />
          <Text style={styles.searchText}>Search restaurants...</Text>
        </View>

        <Text style={styles.sectionTitle}>Featured Restaurants</Text>

        {restaurants.map(restaurant => (
          <TouchableOpacity
            key={restaurant.id}
            style={styles.restaurantCard}
            onPress={() => handleNavigateToRestaurant(restaurant.id, restaurant.name, restaurant.price)}
          >
            <Image
              source={{ uri: 'https://via.placeholder.com/350x150' }}
              style={styles.restaurantImage}
            />
            <View style={styles.restaurantInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.rating}>{restaurant.rating}</Text>
                </View>
              </View>
              <Text style={styles.reviews}>{restaurant.reviews} reviews</Text>
              <View style={styles.deliveryRow}>
                <Ionicons name="bicycle" size={14} color="#666" />
                <Text style={styles.deliveryText}>Delivery: ${restaurant.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },
  searchText: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  restaurantCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#eee',
  },
  restaurantImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#eee',
  },
  restaurantInfo: {
    padding: 12,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff9e6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
    marginLeft: 2,
  },
  reviews: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});

export default React.memo(HomeScreen);
