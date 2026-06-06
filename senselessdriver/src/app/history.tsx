import { BottomTabInset } from '@/constants/theme';
import { getAllTrips, Trip } from '@/db/db';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BOTTOM_NAV_HEIGHT = Platform.OS === 'web' ? 80 : BottomTabInset;

export default function HistoryScreen() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);

  useFocusEffect(
    useCallback(() => {
      setTrips(getAllTrips());
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trip History</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.tripsList}>
          {trips.length === 0 ? (
            <Text style={styles.emptyText}>No trips recorded yet.</Text>
          ) : (
            trips.map(trip => {
              const distance = trip.duration ? (trip.duration * 0.012).toFixed(1) : '0';
              const dateObj = new Date(trip.timestamp);
              const dateString = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
              const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              let scoreColor = '#00ff66';
              if (trip.score < 80) scoreColor = '#ff4d4d';
              else if (trip.score < 90) scoreColor = '#00f0ff';

              return (
                <TouchableOpacity key={trip.id} onPress={() => router.push(`/trip/${trip.id}` as any)}>
                  <View style={styles.tripCard}>
                    <View style={styles.tripIconContainer}>
                      <Ionicons name="car-outline" size={22} color="#ffffff" />
                    </View>
                    <View style={styles.tripInfo}>
                      <Text style={styles.tripTitleText}>{trip.name || 'Untitled Trip'}</Text>
                      <Text style={styles.tripSubtitleText}>{dateString}, {timeString} • {distance} mi</Text>
                    </View>
                    <View style={styles.tripScoreContainer}>
                      <Text style={[styles.tripScoreText, { color: scoreColor }]}>{trip.score}</Text>
                      <View style={[styles.tripScoreDot, { backgroundColor: scoreColor }]} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={{ height: BOTTOM_NAV_HEIGHT + 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0c0d0e',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  tripsList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyText: {
    color: '#8b8f97',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  tripCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16181b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e2025',
  },
  tripIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1e2025',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripInfo: {
    flex: 1,
    marginLeft: 14,
  },
  tripTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tripSubtitleText: {
    fontSize: 12,
    color: '#8b8f97',
    marginTop: 4,
  },
  tripScoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripScoreText: {
    fontSize: 18,
    fontWeight: '900',
  },
  tripScoreDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
});
