import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Line, Circle, Rect, G } from 'react-native-svg';

export function CommuteRouteSvg() {
  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="commuteLineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#60a5fa" />
            <Stop offset="100%" stopColor="#00ff66" />
          </LinearGradient>
          <LinearGradient id="phoneBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#1e2025" />
            <Stop offset="100%" stopColor="#0c0d0e" />
          </LinearGradient>
        </Defs>

        {/* Diagonal grid lines */}
        <G opacity={0.25}>
          <Line x1="-20" y1="20" x2="120" y2="90" stroke="#2e3035" strokeWidth={0.8} />
          <Line x1="-20" y1="40" x2="120" y2="110" stroke="#2e3035" strokeWidth={0.8} />
          <Line x1="-20" y1="0" x2="120" y2="70" stroke="#2e3035" strokeWidth={0.8} />
          <Line x1="-20" y1="-20" x2="120" y2="50" stroke="#2e3035" strokeWidth={0.8} />

          <Line x1="20" y1="-20" x2="-50" y2="120" stroke="#2e3035" strokeWidth={0.8} />
          <Line x1="50" y1="-20" x2="-20" y2="120" stroke="#2e3035" strokeWidth={0.8} />
          <Line x1="80" y1="-20" x2="10" y2="120" stroke="#2e3035" strokeWidth={0.8} />
          <Line x1="110" y1="-20" x2="40" y2="120" stroke="#2e3035" strokeWidth={0.8} />
        </G>

        {/* Isometric Phone Base */}
        <G transform="rotate(-15, 50, 50) translate(0, -2)">
          {/* Phone Shadow */}
          <Rect
            x={28}
            y={22}
            width={44}
            height={60}
            rx={6}
            fill="#000000"
            opacity={0.6}
            transform="translate(4, 4)"
          />
          {/* Phone Outer Rim */}
          <Rect
            x={28}
            y={22}
            width={44}
            height={60}
            rx={6}
            fill="url(#phoneBodyGrad)"
            stroke="#2d2f36"
            strokeWidth={1.5}
          />
          {/* Phone Inner Screen */}
          <Rect
            x={31}
            y={25}
            width={38}
            height={54}
            rx={3}
            fill="#08090a"
            stroke="#161719"
            strokeWidth={1}
          />

          {/* Map Grid on Screen */}
          <G opacity={0.15}>
            <Line x1={31} y1={35} x2={69} y2={35} stroke="#ffffff" strokeWidth={0.5} />
            <Line x1={31} y1={45} x2={69} y2={45} stroke="#ffffff" strokeWidth={0.5} />
            <Line x1={31} y1={55} x2={69} y2={55} stroke="#ffffff" strokeWidth={0.5} />
            <Line x1={31} y1={65} x2={69} y2={65} stroke="#ffffff" strokeWidth={0.5} />
            
            <Line x1={40} y1={25} x2={40} y2={79} stroke="#ffffff" strokeWidth={0.5} />
            <Line x1={50} y1={25} x2={50} y2={79} stroke="#ffffff" strokeWidth={0.5} />
            <Line x1={60} y1={25} x2={60} y2={79} stroke="#ffffff" strokeWidth={0.5} />
          </G>

          {/* Route path on phone screen */}
          <Path
            d="M 38 68 L 46 54 C 48 50, 52 48, 55 52 L 62 40"
            fill="none"
            stroke="url(#commuteLineGrad)"
            strokeWidth={2}
            strokeLinecap="round"
          />

          {/* Start/End Dots */}
          <Circle cx={38} cy={68} r={2} fill="#60a5fa" />
          <Circle cx={38} cy={68} r={3.5} fill="#60a5fa" opacity={0.3} />
          <Circle cx={62} cy={40} r={2} fill="#00ff66" />
          <Circle cx={62} cy={40} r={3.5} fill="#00ff66" opacity={0.3} />
        </G>
      </Svg>
    </View>
  );
}

export function GroceryRouteSvg() {
  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="groceryLineGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <Stop offset="0%" stopColor="#ff4d4d" stopOpacity={0.4} />
            <Stop offset="100%" stopColor="#3b82f6" />
          </LinearGradient>
          <LinearGradient id="gridFadeGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <Stop offset="0%" stopColor="#2e3035" stopOpacity={0.8} />
            <Stop offset="100%" stopColor="#121315" stopOpacity={0.1} />
          </LinearGradient>
        </Defs>

        {/* Slanted perspective grids */}
        <G opacity={0.4}>
          {/* Vertical perspective lines */}
          <Line x1={10} y1={95} x2={45} y2={10} stroke="url(#gridFadeGrad)" strokeWidth={1} />
          <Line x1={30} y1={95} x2={48} y2={10} stroke="url(#gridFadeGrad)" strokeWidth={1} />
          <Line x1={50} y1={95} x2={50} y2={10} stroke="url(#gridFadeGrad)" strokeWidth={1} />
          <Line x1={70} y1={95} x2={52} y2={10} stroke="url(#gridFadeGrad)" strokeWidth={1} />
          <Line x1={90} y1={95} x2={55} y2={10} stroke="url(#gridFadeGrad)" strokeWidth={1} />

          {/* Horizontal grid lines getting closer towards top */}
          <Line x1={0} y1={95} x2={100} y2={95} stroke="url(#gridFadeGrad)" strokeWidth={1} />
          <Line x1={0} y1={82} x2={100} y2={82} stroke="url(#gridFadeGrad)" strokeWidth={1} />
          <Line x1={5} y1={68} x2={95} y2={68} stroke="url(#gridFadeGrad)" strokeWidth={1} />
          <Line x1={15} y1={53} x2={85} y2={53} stroke="url(#gridFadeGrad)" strokeWidth={1} />
          <Line x1={25} y1={37} x2={75} y2={37} stroke="url(#gridFadeGrad)" strokeWidth={1} />
          <Line x1={35} y1={20} x2={65} y2={20} stroke="url(#gridFadeGrad)" strokeWidth={1} />
        </G>

        {/* Route Path (curved receding line) */}
        <Path
          d="M 50 88 C 25 80, 20 60, 48 50 C 70 42, 75 30, 52 18"
          fill="none"
          stroke="url(#groceryLineGrad)"
          strokeWidth={3.5}
          strokeLinecap="round"
        />

        {/* Harsh Event Brake Point (Red dot overlay) */}
        <G>
          <Circle cx={36} cy={53} r={3.5} fill="#ff4d4d" />
          <Circle cx={36} cy={53} r={7} fill="#ff4d4d" opacity={0.4} />
        </G>

        {/* Start / End Landmarks */}
        <Circle cx={50} cy={88} r={2} fill="#3b82f6" />
        <Circle cx={52} cy={18} r={2} fill="#60a5fa" />
      </Svg>
    </View>
  );
}

export function RoadtripRouteSvg() {
  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="roadtripGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#3b82f6" />
            <Stop offset="50%" stopColor="#00f0ff" />
            <Stop offset="100%" stopColor="#00ff66" />
          </LinearGradient>
        </Defs>

        {/* Mountainous Elevation Lines (Wavy contours) */}
        <G opacity={0.2} stroke="#2e3035" strokeWidth={1} fill="none">
          <Path d="M -10 35 Q 20 20, 50 35 T 110 35" />
          <Path d="M -10 48 Q 20 33, 50 48 T 110 48" />
          <Path d="M -10 61 Q 20 46, 50 61 T 110 61" />
          <Path d="M -10 74 Q 20 59, 50 74 T 110 74" />
          <Path d="M -10 87 Q 20 72, 50 87 T 110 87" />
        </G>

        {/* Vertical/Perspective lines mapping space */}
        <G opacity={0.1} stroke="#ffffff" strokeWidth={0.5} fill="none">
          <Line x1={20} y1={100} x2={35} y2={10} />
          <Line x1={50} y1={100} x2={50} y2={10} />
          <Line x1={80} y1={100} x2={65} y2={10} />
        </G>

        {/* Climbing route trail */}
        <Path
          d="M 22 92 C 28 75, 45 78, 48 60 C 51 40, 72 45, 66 24"
          fill="none"
          stroke="url(#roadtripGrad)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray="100"
          strokeDashoffset="0"
        />

        {/* Route Points */}
        <Circle cx={22} cy={92} r={2} fill="#3b82f6" />
        <Circle cx={48} cy={60} r={1.5} fill="#00f0ff" />
        <Circle cx={66} cy={24} r={2.5} fill="#00ff66" />
        <Circle cx={66} cy={24} r={5} fill="#00ff66" opacity={0.3} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#090a0c',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e2025',
    overflow: 'hidden',
  },
});
