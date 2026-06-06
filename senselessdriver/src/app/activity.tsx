import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { BottomTabInset } from '@/constants/theme';
import { CommuteRouteSvg, GroceryRouteSvg, RoadtripRouteSvg } from '@/components/trip-route-svg';
import { getAllTrips, getAverageScore, Trip as DBTrip } from '@/db/db';

// Bottom navigation height padding
const BOTTOM_NAV_HEIGHT = Platform.OS === 'web' ? 80 : BottomTabInset;


type FilterType = 'All' | 'High Score' | 'Risky' | 'Work';

export default function ActivityScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [allTrips, setAllTrips] = useState<DBTrip[]>([]);
  const [avgScore, setAvgScore] = useState(100);

  useFocusEffect(
    useCallback(() => {
      setAllTrips(getAllTrips());
      setAvgScore(getAverageScore());
    }, [])
  );

  const getFilteredTrips = () => {
    switch (activeFilter) {
      case 'High Score':
        return allTrips.filter(trip => trip.score >= 90);
      case 'Risky':
        return allTrips.filter(trip => trip.score < 80 || (trip.eventsCount && trip.eventsCount > 0));
      case 'Work':
        return allTrips.filter(trip => trip.name?.toLowerCase().includes('work') || trip.name?.toLowerCase().includes('commute'));
      default:
        return allTrips;
    }
  };

  const renderRouteSvg = (type: 'commute' | 'grocery' | 'roadtrip') => {
    switch (type) {
      case 'commute':
        return <CommuteRouteSvg />;
      case 'grocery':
        return <GroceryRouteSvg />;
      case 'roadtrip':
        return <RoadtripRouteSvg />;
    }
  };

  const filteredTrips = getFilteredTrips();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Scrollable List */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Top Header Row */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('@/assets/images/driver_avatar.png')}
              style={styles.avatar}
            />
            <Text style={styles.headerTitle}>DriveSense AI</Text>
          </View>
        </View>

        {/* 30-Day Performance Card */}
        <View style={styles.performanceCard}>
          <Text style={styles.performanceLabel}>30-DAY PERFORMANCE</Text>
          <View style={styles.scoreRow}>
            <Text style={styles.largeScore}>{avgScore}</Text>
            <View style={styles.trendContainer}>
              <Feather name="trending-up" size={14} color="#00ff66" />
              <Text style={styles.trendText}>+4%</Text>
              <Text style={styles.trendSubText}>vs last month</Text>
            </View>
          </View>
          <Text style={styles.averageScoreLabel}>Average Driving Score</Text>
          {/* Progress Bar Container */}
          <View style={styles.progressContainer}>
            <LinearGradient
              colors={['#3b82f6', '#00f0ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFilled, { width: `${avgScore}%` }]}
            />
          </View>
        </View>

        {/* Filters Filter Row */}
        <View style={styles.filtersScrollContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersRow}
          >
            {(['All', 'High Score', 'Risky', 'Work'] as FilterType[]).map(filter => {
              const isActive = activeFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  activeOpacity={0.8}
                  onPress={() => setActiveFilter(filter)}
                  style={[
                    styles.filterPill,
                    isActive ? styles.filterPillActive : styles.filterPillInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      isActive ? styles.filterPillTextActive : styles.filterPillTextInactive,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Trips List */}
        <View style={styles.tripsContainer}>
          {filteredTrips.length > 0 ? (
            filteredTrips.map(trip => {
              // Score colors
              const isHigh = trip.score >= 90;
              const badgeBg = isHigh ? 'rgba(0, 255, 102, 0.05)' : 'rgba(139, 143, 151, 0.05)';
              const badgeBorder = isHigh ? 'rgba(0, 255, 102, 0.2)' : 'rgba(139, 143, 151, 0.2)';
              const badgeDotColor = isHigh ? '#00ff66' : '#8b8f97';

              const distance = trip.duration ? (trip.duration * 0.012).toFixed(1) + ' mi' : '0 mi';
              const durationStr = trip.duration ? `${Math.floor(trip.duration / 60)}m ${trip.duration % 60}s` : '0m';
              
              const dateObj = new Date(trip.timestamp);
              const dateString = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' • ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              const svgType = trip.duration && trip.duration > 3600 ? 'roadtrip' : (trip.name?.toLowerCase().includes('grocery') ? 'grocery' : 'commute');
              const eventsStr = trip.eventsCount ? `${trip.eventsCount} Event(s)` : '0 Events';
              const eventsColor = trip.eventsCount && trip.eventsCount > 0 ? '#ff4d4d' : '#8b8f97';

              return (
                <TouchableOpacity key={trip.id} activeOpacity={0.8} onPress={() => router.push(`/trip/${trip.id}` as any)}>
                  <View style={styles.tripCard}>
                    {/* Card Header Info */}
                    <View style={styles.tripCardHeader}>
                      <Text style={styles.tripDateText}>{dateString}</Text>
                      <View
                        style={[
                          styles.scoreBadge,
                          { backgroundColor: badgeBg, borderColor: badgeBorder },
                        ]}
                      >
                        <Text style={[styles.scoreBadgeText, { color: isHigh ? '#00ff66' : '#ffffff' }]}>
                          {trip.score}
                        </Text>
                        <View style={[styles.scoreBadgeDot, { backgroundColor: badgeDotColor }]} />
                      </View>
                    </View>

                    {/* Trip Title */}
                    <Text style={styles.tripTitle}>{trip.name || 'Untitled Trip'}</Text>

                    {/* Stats Grid & Map Visual */}
                    <View style={styles.cardContentRow}>
                      {/* SVG Route Visualization */}
                      <View style={styles.mapWrapper}>
                        {renderRouteSvg(svgType as any)}
                      </View>

                      {/* Stats Layout */}
                      <View style={styles.statsGrid}>
                        {/* Row 1 */}
                        <View style={styles.statsGridRow}>
                          <View style={styles.statCell}>
                            <Text style={styles.statLabel}>Distance</Text>
                            <Text style={styles.statValue}>{distance}</Text>
                          </View>
                          <View style={styles.statCell}>
                            <Text style={styles.statLabel}>Duration</Text>
                            <Text style={styles.statValue}>{durationStr}</Text>
                          </View>
                        </View>

                        {/* Row 2 */}
                        <View style={[styles.statsGridRow, { marginTop: 12 }]}>
                          <View style={styles.statCell}>
                            <Text style={styles.statLabel}>Events</Text>
                            <Text
                              style={[
                                styles.statValue,
                                { color: eventsColor },
                              ]}
                            >
                              {eventsStr}
                            </Text>
                          </View>
                          <View style={styles.statCell}>
                            <Text style={styles.statLabel}>Status</Text>
                            <View style={styles.statusValueContainer}>
                              <Ionicons
                                name={isHigh ? "checkmark-circle-outline" : "warning-outline"}
                                size={14}
                                color={isHigh ? '#00ff66' : '#ff4d4d'}
                                style={styles.statusIcon}
                              />
                              <Text
                                style={[
                                  styles.statValue,
                                  { color: isHigh ? '#00ff66' : '#ff4d4d' },
                                ]}
                              >
                                {isHigh ? 'Safe' : 'Risky'}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="car-outline" size={48} color="#2e3035" />
              <Text style={styles.emptyText}>No trips found for this category.</Text>
            </View>
          )}
        </View>

        {/* Dynamic bottom bar spacing */}
        <View style={{ height: BOTTOM_NAV_HEIGHT + 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0c0d0e',
  },
  scrollContainer: {
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2e3035',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 12,
  },
  settingsButton: {
    padding: 4,
  },
  performanceCard: {
    backgroundColor: '#121315',
    borderWidth: 1,
    borderColor: '#1e2025',
    borderRadius: 20,
    marginHorizontal: 24,
    padding: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  performanceLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8b8f97',
    letterSpacing: 1,
    marginBottom: 10,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  largeScore: {
    fontSize: 72,
    fontWeight: '900',
    color: '#ffffff',
    lineHeight: 72,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    color: '#00ff66',
    fontWeight: 'bold',
    fontSize: 14,
  },
  trendSubText: {
    color: '#8b8f97',
    fontSize: 11,
    marginLeft: 2,
  },
  averageScoreLabel: {
    fontSize: 14,
    color: '#B0B4BA',
    marginTop: 6,
    marginBottom: 20,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#1e2025',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFilled: {
    height: '100%',
    borderRadius: 3,
  },
  filtersScrollContainer: {
    marginBottom: 16,
  },
  filtersRow: {
    paddingHorizontal: 24,
    gap: 10,
    flexDirection: 'row',
  },
  filterPill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: '#a3c3ff', // Light blue/violet pill active
  },
  filterPillInactive: {
    backgroundColor: '#0c0d0e',
    borderWidth: 1,
    borderColor: '#2e3035',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  filterPillTextActive: {
    color: '#0c0d0e',
  },
  filterPillTextInactive: {
    color: '#ffffff',
  },
  tripsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  tripCard: {
    backgroundColor: '#121315',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e2025',
    padding: 16,
  },
  tripCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripDateText: {
    fontSize: 12,
    color: '#8b8f97',
    fontWeight: '500',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 6,
  },
  scoreBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  scoreBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 16,
  },
  cardContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapWrapper: {
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statsGrid: {
    flex: 1,
    marginLeft: 16,
  },
  statsGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCell: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#8b8f97',
    marginBottom: 2,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statusValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    color: '#5b5f67',
    fontSize: 14,
  },
});
