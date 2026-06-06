import { BottomTabInset } from '@/constants/theme';
import { initDB, saveTrip, getAverageScore, getRecentTrips, Trip, getTotalDuration, getTotalEvents, getLast7DaysScores } from '@/db/db';
import { useDrivingEval } from '@/hooks/drivingEval';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Line, Path, Rect, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

// Dynamic bottom nav offset for Web vs Native
const BOTTOM_NAV_HEIGHT = Platform.OS === 'web' ? 80 : BottomTabInset;

interface LiveEvent {
  id: string;
  title: string;
  detail: string;
  time: string;
  severity: 'harsh' | 'safe';
}

function CircularProgress({
  score = 88,
  mode = 'dashboard',
}: {
  score?: number;
  mode?: 'dashboard' | 'driving' | 'summary';
}) {
  const radius = 80;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius; // ~502.65
  const activeArcRatio = 0.75; // 270 degree arc
  const totalArcLength = circumference * activeArcRatio; // ~377
  const filledLength = totalArcLength * (score / 100);

  const isDriving = mode === 'driving';
  const isSummary = mode === 'summary';

  // In driving & summary mode, we use a light blue/cyan gradient, else cyan/green
  const gradientColors = (isDriving || isSummary)
    ? { stop0: '#ffffff', stop50: '#dedede', stop100: '#ffffff' }
    : { stop0: '#d2d2d2', stop50: '#ffffff', stop100: '#ffffff' };

  return (
    <View style={styles.gaugeContainer}>
      {/* Svg Circle Gauge */}
      <Svg width={220} height={220} viewBox="0 0 200 200">
        <Defs>
          <SvgLinearGradient id="gaugeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={gradientColors.stop0} />
            <Stop offset="50%" stopColor={gradientColors.stop50} />
            <Stop offset="100%" stopColor={gradientColors.stop100} />
          </SvgLinearGradient>
        </Defs>

        {/* Background Arc Track */}
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

        {/* Glowing layer behind */}
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

        {/* Foreground Filled Progress Arc */}
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

        {/* Top center green indicator dot (Only in driving mode) */}
        {isDriving && (
          <Circle
            cx={100}
            cy={20}
            r={5.5}
            fill="#00ff66"
            stroke="#0c0d0e"
            strokeWidth={1.5}
          />
        )}
      </Svg>

      {/* Inner Score Text */}
      <View style={styles.gaugeTextContainer}>
        {isDriving ? (
          <>
            <Text style={styles.gaugeLabelTextTop}>SAFETY SCORE</Text>
            <Text style={styles.gaugeScoreTextDriving}>{score}</Text>
          </>
        ) : (
          <>
            <Text style={styles.gaugeScoreText}>{score}</Text>
            <Text style={styles.gaugeLabelText}>SAFETY SCORE</Text>
          </>
        )}
      </View>
    </View>
  );
}

function TrendChart({ trendData = [] }: { trendData?: { day: string, score: number }[] }) {
  if (!trendData || trendData.length !== 7) return null;

  const points = trendData.map((d, i) => ({
    x: 20 + i * 50,
    y: 90 - (d.score * 0.7)
  }));

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    pathD += ` C ${prev.x + 25} ${prev.y}, ${curr.x - 25} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  const fillD = `${pathD} L ${points[points.length - 1].x} 95 L ${points[0].x} 95 Z`;

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>7-DAY PERFORMANCE TREND</Text>
        <Feather name="trending-up" size={16} color="#00f0ff" />
      </View>

      <View style={styles.chartContainer}>
        <Svg width="100%" height={100} viewBox="0 0 340 100" preserveAspectRatio="none">
          <Defs>
            <SvgLinearGradient id="chartLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#0088ff" />
              <Stop offset="50%" stopColor="#00f0ff" />
              <Stop offset="100%" stopColor="#00ff66" />
            </SvgLinearGradient>
            <SvgLinearGradient id="chartFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#00f0ff" stopOpacity={0.25} />
              <Stop offset="100%" stopColor="#00f0ff" stopOpacity={0.0} />
            </SvgLinearGradient>
          </Defs>

          {/* Area under bezier line */}
          <Path
            d={fillD}
            fill="url(#chartFillGrad)"
          />

          {/* Bezier Line */}
          <Path
            d={pathD}
            fill="none"
            stroke="url(#chartLineGrad)"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </Svg>
      </View>

      <View style={styles.chartDaysRow}>
        {trendData.map((d, i) => (
          <Text key={i} style={styles.chartDayText}>{d.day}</Text>
        ))}
      </View>
    </View>
  );
}

function DriveDurationGraphic({ duration = 0 }: { duration: number }) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const timeStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <View style={styles.graphicContainer}>
      <Svg width={200} height={100} viewBox="0 0 200 100">
        {/* Car rear silhouette */}
        <Path
          d="M 65 50 C 65 38, 72 32, 100 32 C 128 32, 135 38, 135 50 C 135 58, 130 62, 100 62 C 70 62, 65 58, 65 50 Z"
          fill="#1c1d21"
          stroke="#2d2f36"
          strokeWidth={1.5}
        />
        {/* Rear Windshield */}
        <Path
          d="M 75 46 C 75 39, 80 37, 100 37 C 120 37, 125 39, 125 46 Z"
          fill="#0c0d0e"
          stroke="#222327"
          strokeWidth={1}
        />
        {/* Left taillight (red glow) */}
        <Rect x={72} y={49} width={14} height={4} rx={2} fill="#ff4d4d" />
        <Rect x={70} y={47} width={18} height={8} rx={4} fill="#ff4d4d" opacity={0.3} />

        {/* Right taillight (red glow) */}
        <Rect x={114} y={49} width={14} height={4} rx={2} fill="#ff4d4d" />
        <Rect x={112} y={47} width={18} height={8} rx={4} fill="#ff4d4d" opacity={0.3} />

        {/* Radiating road lines */}
        <Line x1={80} y1={68} x2={55} y2={98} stroke="#2a2c32" strokeWidth={2.5} strokeLinecap="round" />
        <Line x1={100} y1={68} x2={100} y2={98} stroke="#2a2c32" strokeWidth={2.5} strokeLinecap="round" />
        <Line x1={120} y1={68} x2={145} y2={98} stroke="#2a2c32" strokeWidth={2.5} strokeLinecap="round" />
      </Svg>

      {/* Overlapping Duration Readout */}
      <View style={styles.speedOverlay}>
        <Text style={styles.speedNumber}>{timeStr}</Text>
        <Text style={styles.speedLabel}>MIN</Text>
      </View>
    </View>
  );
}

function IncidentDonut() {
  const radius = 30;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius; // ~188.5

  // 3 events total (2 braking = 66.6%, 1 steering = 33.3%)
  const segment1Length = circumference * (2 / 3);
  const segment2Length = circumference * (1 / 3);

  return (
    <View style={styles.donutContainer}>
      <Svg width={90} height={90} viewBox="0 0 80 80">
        {/* Segment 1: Braking (Pink) */}
        <Circle
          cx={40}
          cy={40}
          r={radius}
          fill="none"
          stroke="#fca5a5"
          strokeWidth={strokeWidth}
          strokeDasharray={`${segment1Length} ${circumference}`}
          rotation={-90}
          originX={40}
          originY={40}
        />
        {/* Segment 2: Steering (Blue) */}
        <Circle
          cx={40}
          cy={40}
          r={radius}
          fill="none"
          stroke="#93c5fd"
          strokeWidth={strokeWidth}
          strokeDasharray={`${segment2Length} ${circumference}`}
          strokeDashoffset={-segment1Length}
          rotation={-90}
          originX={40}
          originY={40}
        />
      </Svg>
    </View>
  );
}

function RouteMap() {
  return (
    <View style={styles.routeCard}>
      <Svg width="100%" height={150} style={styles.routeSvg}>
        <Defs>
          <SvgLinearGradient id="routeLineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#60a5fa" />
            <Stop offset="50%" stopColor="#00f0ff" />
            <Stop offset="100%" stopColor="#00ff66" />
          </SvgLinearGradient>
        </Defs>

        {/* Slanted perspective grid lines */}
        <Line x1={-50} y1={20} x2={350} y2={20} stroke="#1e2025" strokeWidth={1} opacity={0.6} />
        <Line x1={-50} y1={45} x2={350} y2={45} stroke="#1e2025" strokeWidth={1} opacity={0.6} />
        <Line x1={-50} y1={70} x2={350} y2={70} stroke="#1e2025" strokeWidth={1} opacity={0.6} />
        <Line x1={-50} y1={95} x2={350} y2={95} stroke="#1e2025" strokeWidth={1} opacity={0.6} />
        <Line x1={-50} y1={120} x2={350} y2={120} stroke="#1e2025" strokeWidth={1} opacity={0.6} />
        <Line x1={-50} y1={145} x2={350} y2={145} stroke="#1e2025" strokeWidth={1} opacity={0.6} />

        <Line x1={40} y1={0} x2={-40} y2={160} stroke="#1e2025" strokeWidth={1} opacity={0.6} />
        <Line x1={100} y1={0} x2={40} y2={160} stroke="#1e2025" strokeWidth={1} opacity={0.6} />
        <Line x1={160} y1={0} x2={120} y2={160} stroke="#1e2025" strokeWidth={1} opacity={0.6} />
        <Line x1={220} y1={0} x2={200} y2={160} stroke="#1e2025" strokeWidth={1} opacity={0.6} />
        <Line x1={280} y1={0} x2={280} y2={160} stroke="#1e2025" strokeWidth={1} opacity={0.6} />
        <Line x1={340} y1={0} x2={360} y2={160} stroke="#1e2025" strokeWidth={1} opacity={0.6} />

        {/* Route Path (Glowing cyan loop) */}
        <Path
          d="M 60 110 L 160 55 C 180 45, 210 50, 210 70 C 210 90, 185 95, 160 85 L 63 118"
          fill="none"
          stroke="url(#routeLineGrad)"
          strokeWidth={8}
          strokeLinecap="round"
          opacity={0.25}
        />
        <Path
          d="M 60 110 L 160 55 C 180 45, 210 50, 210 70 C 210 90, 185 95, 160 85 L 63 118"
          fill="none"
          stroke="url(#routeLineGrad)"
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* Start / loop landmarks */}
        <Circle cx={60} cy={110} r={5} fill="#00ff66" />
        <Circle cx={60} cy={110} r={8} fill="#00ff66" opacity={0.3} />
        <Circle cx={210} cy={70} r={4} fill="#00f0ff" />
      </Svg>

      <View style={styles.routeBadge}>
        <Text style={styles.routeBadgeText}>Route Visualization</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [isDriving, setIsDriving] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [driveDuration, setDriveDuration] = useState(0);
  const [drivingScore, setDrivingScore] = useState(100);
  const [averageScore, setAverageScore] = useState(100);
  const [tripName, setTripName] = useState('');
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [totalDriveDuration, setTotalDriveDuration] = useState(0);
  const [totalUnsafeEvents, setTotalUnsafeEvents] = useState(0);
  const [trendData, setTrendData] = useState<{day: string, score: number}[]>([]);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([
    {
      id: 'init_1',
      title: 'Safe Speed',
      detail: 'Speed matches current flow limits',
      time: '14:00',
      severity: 'safe',
    },
  ]);
  const [blink, setBlink] = useState(true);

  // Hook up sensors (only active when driving and not paused)
  const metrics = useDrivingEval(isDriving && !isPaused);
  const lastTriggered = useRef<{ [key: string]: number }>({});

  // Duration simulator and initial load
  useEffect(() => {
    initDB();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setAverageScore(getAverageScore());
      setRecentTrips(getRecentTrips(2));
      setTotalDriveDuration(getTotalDuration());
      setTotalUnsafeEvents(getTotalEvents());
      setTrendData(getLast7DaysScores());
    }, [])
  );

  useEffect(() => {
    if (!isDriving || isPaused) {
      return;
    }

    const durationInterval = setInterval(() => {
      setDriveDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(durationInterval);
  }, [isDriving, isPaused]);

  // Real-time tracking blinking dot effect
  useEffect(() => {
    if (!isDriving || isPaused) return;

    const blinkInterval = setInterval(() => {
      setBlink(b => !b);
    }, 1000);

    return () => clearInterval(blinkInterval);
  }, [isDriving, isPaused]);

  // Live telemetry listener & events generator
  useEffect(() => {
    if (!isDriving || isPaused) return;

    const now = Date.now();
    const throttleTime = 5000; // 5s cooldown per event type

    const addEvent = (type: string, title: string, detail: string, severity: 'harsh' | 'safe') => {
      const lastTime = lastTriggered.current[type] || 0;
      if (now - lastTime < throttleTime) return;

      lastTriggered.current[type] = now;

      const padZero = (n: number) => (n < 10 ? '0' + n : n);
      const d = new Date();
      const timeStr = `${padZero(d.getHours())}:${padZero(d.getMinutes())}`;

      const newEvent: LiveEvent = {
        id: now.toString() + '_' + type,
        title,
        detail,
        time: timeStr,
        severity,
      };

      setLiveEvents(prev => [newEvent, ...prev]);
    };

    // Sensor checks
    if (metrics.harshBraking) {
      addEvent('harshBraking', 'Harsh Braking', '0.85G Deceleration Detected', 'harsh');
      setDrivingScore(prev => Math.max(0, prev - 5));
    } else if (metrics.harshAcceleration) {
      addEvent('harshAcceleration', 'Harsh Acceleration', '0.72G Acceleration Detected', 'harsh');
      setDrivingScore(prev => Math.max(0, prev - 5));
    } else if (metrics.sharpTurn || metrics.AggressiveSteering) {
      addEvent('sharpTurn', 'Sharp Turn', 'High lateral G-Force detected', 'harsh');
      setDrivingScore(prev => Math.max(0, prev - 5));
    } else if (metrics.phoneUseWhileDriving) {
      addEvent('phoneUse', 'Phone Distraction', 'Excessive device movement detected', 'harsh');
      setDrivingScore(prev => Math.max(0, prev - 10));
    }
  }, [metrics, isDriving, isPaused]);

  // Periodically insert normal/safe events to keep driving dashboard alive and looking premium
  useEffect(() => {
    if (!isDriving || isPaused) return;

    const safeSimulator = setInterval(() => {
      const padZero = (n: number) => (n < 10 ? '0' + n : n);
      const d = new Date();
      const timeStr = `${padZero(d.getHours())}:${padZero(d.getMinutes())}`;

      const randomSafeText = [
        { title: 'Safe Speed', detail: 'Velocity stable and within limits' },
        { title: 'Smooth Cornering', detail: 'Lateral steering forces optimal' },
        { title: 'Distance Secure', detail: 'Safe gap maintained behind lead car' },
      ][Math.floor(Math.random() * 3)];

      const newEvent: LiveEvent = {
        id: Date.now().toString(),
        title: randomSafeText.title,
        detail: randomSafeText.detail,
        time: timeStr,
        severity: 'safe',
      };

      setLiveEvents(prev => [newEvent, ...prev]);
    }, 12000);

    return () => clearInterval(safeSimulator);
  }, [isDriving, isPaused]);

  const handleStartDrive = () => {
    setIsDriving(true);
    setIsPaused(false);
    setShowSummary(false);
    setDriveDuration(0);
    setDrivingScore(100);
    // Reset list with an initial safe item
    setLiveEvents([
      {
        id: 'init_1',
        title: 'GPS Connected',
        detail: 'High-precision telemetry link secure',
        time: (() => {
          const padZero = (n: number) => (n < 10 ? '0' + n : n);
          const d = new Date();
          return `${padZero(d.getHours())}:${padZero(d.getMinutes())}`;
        })(),
        severity: 'safe',
      },
    ]);
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  const handleEndDrive = () => {
    setIsDriving(false);
    setIsPaused(false);
    setShowSummary(true); // Open trip summary screen
    
    const harshEventsCount = liveEvents.filter(e => e.severity === 'harsh').length;
    saveTrip(tripName || 'Untitled Trip', drivingScore, driveDuration, harshEventsCount);
    setAverageScore(getAverageScore());
    setRecentTrips(getRecentTrips(2));
    setTotalDriveDuration(getTotalDuration());
    setTotalUnsafeEvents(getTotalEvents());
    setTrendData(getLast7DaysScores());
  };

  // --- RENDERING TRIP SUMMARY SCREEN ---
  if (showSummary) {
    const timelineEvents = [
      {
        time: '08:12 AM',
        title: 'Harsh Braking',
        location: 'Near Maple Avenue Intersection',
        color: '#fca5a5',
      },
      {
        time: '08:24 AM',
        title: 'Sharp Cornering',
        location: 'I-95 Northbound Exit 14',
        color: '#93c5fd',
      },
      {
        time: '08:38 AM',
        title: 'Harsh Braking',
        location: 'Congestion approach near tunnel',
        color: '#fca5a5',
      },
    ];

    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Scrollable Contents */}
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header Row */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Trip Summary</Text>
            <TouchableOpacity onPress={() => setShowSummary(false)} style={styles.settingsButton}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Safety Score Circular Gauge (Score based on current run) */}
          <CircularProgress score={drivingScore} mode="summary" />


          {/* Stats Grid */}
          <View style={styles.statsRow}>
            {/* Duration */}
            <View style={styles.summaryStatCard}>
              <Ionicons name="time-outline" size={20} color="#00f0ff" />
              <Text style={styles.summaryStatNum}>{Math.floor(driveDuration / 60)}m {driveDuration % 60}s</Text>
              <Text style={styles.summaryStatLabel}>Duration</Text>
            </View>
            {/* Distance */}
            <View style={styles.summaryStatCard}>
              <Ionicons name="git-commit-outline" size={20} color="#00f0ff" style={{ transform: [{ rotate: '90deg' }] }} />
              <Text style={styles.summaryStatNum}>{(driveDuration * 0.012).toFixed(1)} mi</Text>
              <Text style={styles.summaryStatLabel}>Distance</Text>
            </View>
            {/* Events count */}
            <View style={styles.summaryStatCard}>
              <Ionicons name="warning-outline" size={20} color="#fca5a5" />
              <Text style={[styles.summaryStatNum, { color: '#fca5a5' }]}>{liveEvents.filter(e => e.severity === 'harsh').length}</Text>
              <Text style={styles.summaryStatLabel}>Events</Text>
            </View>
          </View>

          {/* Incident Breakdown Card */}
          <View style={styles.chartCard}>
            <Text style={styles.statLabel}>INCIDENT BREAKDOWN</Text>
            <View style={styles.donutLayoutRow}>
              <IncidentDonut />
              <View style={styles.legendContainer}>
                <View style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: '#fca5a5' }]} />
                  <Text style={styles.legendText}>Braking (2)</Text>
                </View>
                <View style={[styles.legendRow, { marginTop: 10 }]}>
                  <View style={[styles.legendDot, { backgroundColor: '#93c5fd' }]} />
                  <Text style={styles.legendText}>Steering (1)</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Incident Timeline Card */}
          <View style={styles.chartCard}>
            <Text style={styles.statLabel}>INCIDENT TIMELINE</Text>
            <View style={styles.timelineList}>
              {timelineEvents.map((event, index) => {
                const isLast = index === timelineEvents.length - 1;
                return (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View style={[styles.timelineDot, { backgroundColor: event.color }]} />
                      {!isLast && <View style={styles.timelineLine} />}
                    </View>
                    <View style={styles.timelineRight}>
                      <Text style={styles.timelineTimeText}>{event.time}</Text>
                      <Text style={styles.timelineTitleText}>{event.title}</Text>
                      <Text style={styles.timelineLocText}>{event.location}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
          {/* Spacing for Done button */}
          <View style={{ height: BOTTOM_NAV_HEIGHT + 100 }} />
        </ScrollView>

        {/* Floating Done Button at Bottom */}
        <View style={[styles.floatingButtonContainer, { bottom: BOTTOM_NAV_HEIGHT + 16 }]}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => setShowSummary(false)} style={styles.touchableButton}>
            <LinearGradient
              colors={['#00c8ff', '#00f0ff', '#00ff66']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Done</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.syncText}>DATA SYNC COMPLETE • 10.2 KB</Text>
        </View>
      </SafeAreaView>
    );
  }

  // --- RENDERING DRIVING MODE SCREEN ---
  if (isDriving) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header Row */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image
                source={require('@/assets/images/driver_avatar.png')}
                style={[styles.avatar, { borderColor: '#00c8ff' }]}
              />
              <Text style={styles.headerTitle}>DriveSense AI</Text>
              {/* GPS badge */}
              <View style={styles.gpsBadge}>
                <Ionicons name="locate" size={11} color="#00ff66" />
                <Text style={styles.gpsBadgeText}>STABLE</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={22} color="#8b8f97" />
            </TouchableOpacity>
          </View>

          {/* Safety Score Gauge (Score dynamic in driving mode) */}
          <CircularProgress score={drivingScore} mode="driving" />

          {/* Status Row */}
          <View style={styles.statusRow}>
            {/* Battery status */}
            <View style={styles.statusCol}>
              <Ionicons name="battery-charging" size={18} color="#8b8f97" />
              <Text style={styles.statusValText}>78%</Text>
            </View>
            {/* Sensor state */}
            <View style={styles.statusCol}>
              <Feather name="rss" size={18} color={isPaused ? '#8b8f97' : '#00ff66'} />
              <Text style={[styles.statusValText, !isPaused && { color: '#ffffff' }]}>
                {isPaused ? 'PAUSED' : 'ACTIVE'}
              </Text>
            </View>
            {/* Network */}
            <View style={styles.statusCol}>
              <Ionicons name="cellular" size={18} color="#8b8f97" />
              <Text style={styles.statusValText}>5G</Text>
            </View>
          </View>

          {/* Car Duration Graphic (car rear with tails, road, MM:SS) */}
          <DriveDurationGraphic duration={driveDuration} />

          {/* Live Events Header */}
          <View style={styles.tripsHeader}>
            <Text style={styles.tripsTitle}>LIVE EVENTS</Text>
            <View style={styles.trackingIndicator}>
              <View
                style={[
                  styles.trackingIndicatorDot,
                  { opacity: blink ? 1 : 0.4 },
                ]}
              />
              <Text style={styles.trackingIndicatorText}>REAL-TIME TRACKING</Text>
            </View>
          </View>

          {/* Live Events List */}
          <View style={styles.tripsList}>
            {liveEvents.map(event => (
              <View
                key={event.id}
                style={[
                  styles.eventCard,
                  event.severity === 'harsh' ? styles.eventCardHarsh : styles.eventCardSafe,
                ]}
              >
                <View
                  style={[
                    styles.eventIconContainer,
                    event.severity === 'harsh' ? styles.eventIconHarsh : styles.eventIconSafe,
                  ]}
                >
                  <Ionicons
                    name={event.severity === 'harsh' ? 'warning-outline' : 'shield-checkmark-outline'}
                    size={20}
                    color={event.severity === 'harsh' ? '#ff4d4d' : '#00ff66'}
                  />
                </View>
                <View style={styles.tripInfo}>
                  <Text style={styles.tripTitleText}>{event.title}</Text>
                  <Text style={styles.tripSubtitleText}>{event.detail}</Text>
                </View>
                <View style={styles.tripScoreContainer}>
                  <Text style={styles.eventTimeText}>{event.time}</Text>
                  <View
                    style={[
                      styles.tripScoreDot,
                      { backgroundColor: event.severity === 'harsh' ? '#ff4d4d' : '#00ff66', marginTop: 6 },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Bottom spacing */}
          <View style={{ height: BOTTOM_NAV_HEIGHT + 100 }} />
        </ScrollView>

        {/* Floating Driving Control Buttons */}
        <View style={[styles.controlButtonsContainer, { bottom: BOTTOM_NAV_HEIGHT + 24 }]}>
          {/* Pause/Resume Drive */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePauseToggle}
            style={[styles.controlButton, styles.controlButtonPause]}
          >
            <Ionicons
              name={isPaused ? 'play-circle-outline' : 'pause-circle-outline'}
              size={20}
              color="#ffffff"
            />
            <Text style={styles.controlButtonText}>
              {isPaused ? 'Resume' : 'Pause'} Drive
            </Text>
          </TouchableOpacity>

          {/* End Drive */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleEndDrive}
            style={[styles.controlButton, styles.controlButtonEnd]}
          >
            <Ionicons name="stop-circle-outline" size={20} color="#7f1d1d" />
            <Text style={[styles.controlButtonText, { color: '#7f1d1d' }]}>
              End Drive
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- RENDERING MAIN DASHBOARD SCREEN ---
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Scrollable Contents */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Row */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('@/assets/images/driver_avatar.png')}
              style={styles.avatar}
            />
            <Text style={styles.headerTitle}>DriveSense AI</Text>
          </View>
        </View>

        {/* Circular Progress Gauge (Average Score in Dashboard) */}
        <CircularProgress score={averageScore} mode="dashboard" />

        {/* Excellent Rating Badge */}
        <View style={styles.badge}>
          <Ionicons name="shield-checkmark" size={15} color="#00ff66" />
          <Text style={styles.badgeText}>EXCELLENT RATING</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL DRIVE DURATION</Text>
            <View style={styles.statValueContainer}>
              <Text style={styles.statNumber}>{Math.floor(totalDriveDuration / 60)}</Text>
              <Text style={styles.statSubText}>mins</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>UNSAFE EVENTS</Text>
            <View style={styles.statValueContainer}>
              <Text style={[styles.statNumber, { color: totalUnsafeEvents > 0 ? '#ff4a4a' : '#00ff66' }]}>{totalUnsafeEvents}</Text>
              <Text style={styles.statSubText}>LIFETIME TOTAL</Text>
            </View>
          </View>
        </View>

        {/* Performance Trend Chart */}
        <TrendChart trendData={trendData} />

        {/* Recent Trips Header */}
        <View style={styles.tripsHeader}>
          <Text style={styles.tripsTitle}>Recent Trips</Text>
          <TouchableOpacity onPress={() => router.push('/history')}>
            <Text style={styles.viewAllButton}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Trips List */}
        <View style={styles.tripsList}>
          {recentTrips.length === 0 ? (
            <Text style={{ color: '#8b8f97', textAlign: 'center', marginTop: 10 }}>No trips recorded yet.</Text>
          ) : (
            recentTrips.map(trip => {
              const distance = trip.duration ? (trip.duration * 0.012).toFixed(1) : '0';
              const dateObj = new Date(trip.timestamp);
              const dateString = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
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

        {/* Spacing for bottom tab & floating button */}
        <View style={{ height: BOTTOM_NAV_HEIGHT + 90 }} />
      </ScrollView>

      {/* Floating Start Drive Button */}
      <View style={[styles.floatingButtonContainer, { bottom: BOTTOM_NAV_HEIGHT + 30 }]}>
        <TextInput
          style={styles.tripNameInput}
          placeholder="Name your trip..."
          placeholderTextColor="#8b8f97"
          value={tripName}
          onChangeText={setTripName}
        />
        <TouchableOpacity activeOpacity={0.8} onPress={handleStartDrive} style={styles.touchableButton}>
          <LinearGradient
            colors={['#c7c7c7', '#e3e5e5', '#ffffff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Ionicons name="play-circle-outline" size={22} color="#08101f" />
            <Text style={styles.buttonText}>START DRIVE</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0c0d0e',
  },
  scrollContainer: {
    paddingBottom: 20,
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
  gpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 102, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.25)',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginLeft: 10,
    gap: 4,
  },
  gpsBadgeText: {
    color: '#00ff66',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  settingsButton: {
    padding: 4,
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
  gaugeScoreTextDriving: {
    fontSize: 66,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -1,
    marginTop: -4,
  },
  gaugeLabelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8b8f97',
    letterSpacing: 2,
    marginTop: -2,
  },
  gaugeLabelTextTop: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8b8f97',
    letterSpacing: 2,
    marginBottom: -4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 102, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.2)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginBottom: 28,
  },
  badgeText: {
    color: '#00ff66',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 14,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#121315',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e2025',
    padding: 16,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8b8f97',
    letterSpacing: 1,
    marginBottom: 6,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statSubText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#5b5f67',
    marginLeft: 6,
  },
  chartCard: {
    backgroundColor: '#121315',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e2025',
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 28,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8b8f97',
    letterSpacing: 1,
  },
  chartContainer: {
    height: 100,
    justifyContent: 'center',
  },
  chartDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  chartDayText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#5b5f67',
  },
  tripsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  tripsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  viewAllButton: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#8b8f97',
    letterSpacing: 1,
  },
  tripsList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  tripCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121315',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e2025',
    padding: 14,
  },
  tripIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1b1c20',
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
    marginTop: 2,
  },
  tripScoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tripScoreDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  floatingButtonContainer: {
    position: 'absolute',
    
    bottom: 30,
    left: 24,
    right: 24,
    zIndex: 99,
    shadowColor: '#00f0ff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  touchableButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    gap: 8,
  },
  buttonText: {
    color: '#08101f',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  // --- DRIVING MODE STYLES ---
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    marginVertical: 16,
  },
  statusCol: {
    alignItems: 'center',
    gap: 6,
  },
  statusValText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#8b8f97',
    letterSpacing: 0.5,
  },
  graphicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    position: 'relative',
  },
  speedOverlay: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  speedNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 48,
  },
  speedLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#00f0ff',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  trackingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trackingIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00ff66',
  },
  trackingIndicatorText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#00ff66',
    letterSpacing: 0.5,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  eventCardHarsh: {
    backgroundColor: '#1a1213',
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  eventCardSafe: {
    backgroundColor: '#121a14',
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  eventIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventIconHarsh: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  eventIconSafe: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  eventTimeText: {
    fontSize: 12,
    color: '#8b8f97',
    fontWeight: '500',
  },
  controlButtonsContainer: {
    position: 'absolute',
    left: 24,
    right: 24,
    zIndex: 99,
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 30,
    gap: 8,
  },
  controlButtonPause: {
    backgroundColor: '#121315',
    borderWidth: 1,
    borderColor: '#2e3035',
  },
  controlButtonEnd: {
    backgroundColor: '#fecaca',
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  // --- TRIP SUMMARY STYLES ---
  summarySubText: {
    fontSize: 14,
    color: '#B0B4BA',
    textAlign: 'center',
    paddingHorizontal: 36,
    marginBottom: 20,
    lineHeight: 20,
  },
  greenText: {
    color: '#00ff66',
    fontWeight: 'bold',
  },
  summaryStatCard: {
    flex: 1,
    backgroundColor: '#121315',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e2025',
    paddingVertical: 14,
    alignItems: 'center',
  },
  summaryStatNum: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 6,
  },
  summaryStatLabel: {
    fontSize: 10,
    color: '#8b8f97',
    marginTop: 2,
    fontWeight: '600',
  },
  insightsCard: {
    backgroundColor: '#12151d',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 20,
    position: 'relative',
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightsIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 12,
  },
  insightsDesc: {
    fontSize: 13.5,
    color: '#B0B4BA',
    lineHeight: 20,
    fontStyle: 'italic',
    marginTop: 12,
    paddingRight: 10,
  },
  insightsBadge: {
    position: 'absolute',
    bottom: -10,
    right: 14,
    zIndex: 10,
    backgroundColor: '#0c0d0e',
    borderRadius: 12,
  },
  donutLayoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  donutContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendContainer: {
    flex: 1,
    marginLeft: 24,
    justifyContent: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 13,
    color: '#ffffff',
    marginLeft: 8,
    fontWeight: '500',
  },
  timelineList: {
    paddingLeft: 4,
    marginTop: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 24,
    position: 'relative',
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 10,
    marginTop: 4,
  },
  timelineLine: {
    position: 'absolute',
    left: 3,
    top: 12,
    bottom: -28,
    width: 1.5,
    backgroundColor: '#2e3035',
  },
  timelineRight: {
    flex: 1,
    paddingLeft: 12,
  },
  timelineTimeText: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#8b8f97',
    letterSpacing: 0.5,
  },
  timelineTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 2,
  },
  timelineLocText: {
    fontSize: 11.5,
    color: '#5b5f67',
    marginTop: 2,
  },
  routeCard: {
    backgroundColor: '#121315',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e2025',
    marginHorizontal: 24,
    marginBottom: 24,
    overflow: 'hidden',
    height: 150,
    position: 'relative',
  },
  routeSvg: {
    width: '100%',
    height: '100%',
  },
  routeBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(12, 13, 14, 0.85)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2e3035',
  },
  routeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#B0B4BA',
  },
  syncText: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#5b5f67',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  tripNameInput: {
    backgroundColor: '#1e2025',
    color: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2e3035',
    textAlign: 'center',
    width: '100%',
  },
});
