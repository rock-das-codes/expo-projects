import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDrivingEval } from './../hooks/drivingEval'; // Adjust path based on your file structure

export default function DrivingTracker() {
  const [isTracking, setIsTracking] = useState(false);
  
  // Pass your tracking state to the custom hook
  const metrics = useDrivingEval(isTracking);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Driving Monitor</Text>
      
      {/* Start/Stop Button */}
      <TouchableOpacity 
        style={[styles.button, isTracking ? styles.buttonStop : styles.buttonStart]} 
        onPress={() => setIsTracking(!isTracking)}
      >
        <Text style={styles.buttonText}>
          {isTracking ? 'Stop Tracking' : 'Start Tracking'}
        </Text>
      </TouchableOpacity>

      {/* Dashboard Metrics */}
      <View style={styles.dashboard}>
        <Text style={styles.dashboardTitle}>Live Telemetry:</Text>
        
        <View style={styles.metricRow}>
          <Text style={styles.label}>💥 Harsh Acceleration:</Text>
          <Text style={[styles.value, metrics.harshAcceleration && styles.danger]}>
            {metrics.harshAcceleration ? '🚨 YES' : '✅ Safe'}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.label}>🛑 Harsh Braking:</Text>
          <Text style={[styles.value, metrics.harshBraking && styles.danger]}>
            {metrics.harshBraking ? '🚨 YES' : '✅ Safe'}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.label}>🔄 Sharp Turn:</Text>
          <Text style={[styles.value, metrics.sharpTurn && styles.danger]}>
            {metrics.sharpTurn ? '🚨 YES' : '✅ Safe'}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.label}>🚗 Aggressive Steering:</Text>
          <Text style={[styles.value, metrics.AggressiveSteering && styles.danger]}>
            {metrics.AggressiveSteering ? '🚨 YES' : '✅ Safe'}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.label}>📱 Phone Distraction:</Text>
          <Text style={[styles.value, metrics.phoneUseWhileDriving && styles.danger]}>
            {metrics.phoneUseWhileDriving ? '🚨 YES' : '✅ Safe'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 40,
  },
  buttonStart: {
    backgroundColor: '#4CAF50',
  },
  buttonStop: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dashboard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#555',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  danger: {
    color: '#F44336',
    fontWeight: 'bold',
  },
});