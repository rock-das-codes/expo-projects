import { getTripById, Trip } from '@/db/db';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

function CircularProgress({ score = 88 }: { score?: number }) {
  const radius = 80;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const activeArcRatio = 0.75;
  const totalArcLength = circumference * activeArcRatio;
  const filledLength = totalArcLength * (score / 100);

  const gradientColors = { stop0: '#d2d2d2', stop50: '#ffffff', stop100: '#ffffff' };

  return (
    <View style={styles.gaugeContainer}>
      <Svg width={220} height={220} viewBox="0 0 200 200">
        <Defs>
          <SvgLinearGradient id="gaugeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={gradientColors.stop0} />
            <Stop offset="50%" stopColor={gradientColors.stop50} />
            <Stop offset="100%" stopColor={gradientColors.stop100} />
          </SvgLinearGradient>
        </Defs>

        <Circle
          cx={100}
          cy={100}
          r={radius}
          fill="none"
          stroke="#1e2025"
          strokeWidth={strokeWidth}
          strokeDasharray={`${totalArcLength} ${circumference}`}
          strokeLinecap="round"
          rotation={135}
          originX={100}
          originY={100}
        />

        <Circle
          cx={100}
          cy={100}
          r={radius}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={strokeWidth + 6}
          strokeDasharray={`${filledLength} ${circumference}`}
          strokeLinecap="round"
          opacity={0.15}
          rotation={135}
          originX={100}
          originY={100}
        />

        <Circle
          cx={100}
          cy={100}
          r={radius}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${filledLength} ${circumference}`}
          strokeLinecap="round"
          rotation={135}
          originX={100}
          originY={100}
        />
      </Svg>

      <View style={styles.gaugeTextContainer}>
        <Text style={styles.gaugeScoreText}>{score}</Text>
        <Text style={styles.gaugeLabelText}>SAFETY SCORE</Text>
      </View>
    </View>
  );
}

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    if (id) {
      const tripData = getTripById(Number(id));
      setTrip(tripData);
    }
  }, [id]);

  if (!trip) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.loadingText}>Loading trip details...</Text>
      </SafeAreaView>
    );
  }

  const durationStr = trip.duration ? `${Math.floor(trip.duration / 60)}m ${trip.duration % 60}s` : '0m 0s';
  const distanceStr = trip.duration ? `${(trip.duration * 0.012).toFixed(1)} mi` : '0 mi';
  
  const dateObj = new Date(trip.timestamp);
  const dateString = dateObj.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.tripHeader}>
          <Text style={styles.tripNameText}>{trip.name || 'Untitled Trip'}</Text>
          <Text style={styles.tripDateText}>{dateString} at {timeString}</Text>
        </View>

        <CircularProgress score={trip.score} />

        <View style={styles.statsRow}>
          <View style={styles.summaryStatCard}>
            <Ionicons name="time-outline" size={20} color="#00f0ff" />
            <Text style={styles.summaryStatNum}>{durationStr}</Text>
            <Text style={styles.summaryStatLabel}>Duration</Text>
          </View>

          <View style={styles.summaryStatCard}>
            <Ionicons name="git-commit-outline" size={20} color="#00f0ff" style={{ transform: [{ rotate: '90deg' }] }} />
            <Text style={styles.summaryStatNum}>{distanceStr}</Text>
            <Text style={styles.summaryStatLabel}>Distance</Text>
          </View>

          <View style={styles.summaryStatCard}>
            <Ionicons name="warning-outline" size={20} color="#fca5a5" />
            <Text style={[styles.summaryStatNum, { color: '#fca5a5' }]}>{trip.eventsCount || 0}</Text>
            <Text style={styles.summaryStatLabel}>Events</Text>
          </View>
        </View>

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  loadingText: {
    color: '#8b8f97',
    textAlign: 'center',
    marginTop: 40,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  tripHeader: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  tripNameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tripDateText: {
    fontSize: 14,
    color: '#8b8f97',
    marginTop: 6,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    position: 'relative',
  },
  gaugeTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeScoreText: {
    fontSize: 66,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -1,
  },
  gaugeLabelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8b8f97',
    letterSpacing: 2,
    marginTop: -2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 20,
    gap: 12,
  },
  summaryStatCard: {
    flex: 1,
    backgroundColor: '#16181b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e2025',
  },
  summaryStatNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
  },
  summaryStatLabel: {
    fontSize: 11,
    color: '#8b8f97',
    marginTop: 4,
  },
});
