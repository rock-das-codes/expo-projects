# DriveSense AI

DriveSense AI is a React Native mobile application built with Expo that evaluates driving behavior in real-time. By utilizing the device's built-in sensors (Accelerometer, Gyroscope, and DeviceMotion), the app acts as an intelligent dashcam and co-pilot, detecting risky driving patterns without requiring external OBD-II hardware.

## 🚀 Tech Stack Used

- **Framework:** React Native & Expo
- **Routing:** Expo Router (File-based navigation)
- **Local Storage:** Expo SQLite (synchronous persistence)
- **Sensors API:** `expo-sensors` (Accelerometer, Gyroscope, DeviceMotion)
- **Styling:** Custom StyleSheet / Global CSS with modern dark UI
- **Icons & Graphics:** Expo Vector Icons (`@expo/vector-icons`), `react-native-svg`

## 📡 Sensors Used

The application relies entirely on on-device telemetry data to analyze driving:
1. **Accelerometer:** Detects linear G-forces to identify harsh acceleration and sharp braking.
2. **Gyroscope:** Detects rotational velocity (radians per second) to identify sharp or aggressive turning.
3. **DeviceMotion:** Tracks overall device movement magnitude to identify phone handling and distracted driving.

## 🧠 Event Detection Strategy & Assumptions

Since the app cannot guarantee the phone's orientation (it could be mounted on the dashboard, lying flat in the cup holder, or placed in a pocket), the detection strategy relies heavily on **vector magnitudes** rather than single-axis tracking. 

- **Magnitude Heuristics:** We calculate the root mean square (RMS) of the `x, y, z` axes. Earth's gravity naturally applies `1.0G`. Any significant spike above `1.0` combined with directional biases helps us classify the event.
- **Filtering:** Raw sensor updates are fired rapidly. The app implements debouncing (cooldown periods) after an event is registered so that a single harsh brake isn't logged 50 times in two seconds.
- **GPS Limitation:** Real speed and exact mapping are mocked/extrapolated in this version since background location tracking is not actively polling.

## ⚙️ Threshold Values Chosen

Based on real-world vehicle physics, the following thresholds were mathematically tuned:

- **Harsh Acceleration & Braking (1.35G):** A resting phone registers `1.0G`. A typical passenger vehicle pulling a harsh brake or acceleration generates an extra `0.35G - 0.5G`. `1.35G` was chosen as the optimal threshold to filter out normal bumps but catch aggressive stops.
- **Sharp Turning (0.55 rad/s):** The gyroscope measures radians/second. A standard sharp corner is taken around `0.5 rad/s`. Values exceeding `0.55 rad/s` are flagged as aggressive steering.
- **Phone Distraction (1.2G):** The DeviceMotion sensor tracks phone pick-ups. A threshold of `1.2G` is low enough to ignore standard car vibrations but sensitive enough to catch someone lifting the phone to text.

## 📊 Driving Score Calculation Logic

Every new trip begins with a perfect **100 Safety Score**. 
As unsafe events occur during the drive, penalties are dynamically applied:

- **Harsh Acceleration:** `-5 points`
- **Harsh Braking:** `-5 points`
- **Aggressive/Sharp Turn:** `-5 points`
- **Phone Distraction / Handling:** `-10 points` (Heavily penalized)

The minimum score is `0`. The user's lifetime performance is aggregated in the dashboard using a historical average of all trips.

## 🛠 How to run locally

### 1. Install Dependencies
Make sure you have Node.js installed. Clone the repository and run:
```bash
npm install
```

### 2. Start the Expo Server
```bash
npx expo start
```

### 3. Run on a Device
- **Physical Device:** Download the **Expo Go** app on your iOS or Android device and scan the QR code presented in your terminal.
- **Emulator:** Press `a` in the terminal to open in Android Studio Emulator, or `i` to open in iOS Simulator.

*Note: Sensor APIs (Accelerometer/Gyroscope) will not produce real data on desktop emulators. For the best experience, run the app on a physical device.*

## 📸 Screenshots
<img width="1080" height="2460" alt="Screenshot_20260606-224202" src="https://github.com/user-attachments/assets/b79428d1-92c2-4091-b9f5-c43dd94c6a1a" />
<img width="1080" height="2460" alt="Screenshot_20260606-224121" src="https://github.com/user-attachments/assets/37f0be30-b994-418b-ac1a-b1a02b256245" />
<img width="1080" height="2460" alt="Screenshot_20260606-224129" src="https://github.com/user-attachments/assets/c3e94813-2a51-4c2c-aefc-bfff0bd90e8c" />
<img width="1080" height="2460" alt="Screenshot_20260606-224136" src="https://github.com/user-attachments/assets/c23b78dd-39df-40f3-9022-48e3f6f6e6d2" />
<img width="1080" height="2460" alt="Screenshot_20260606-224139" src="https://github.com/user-attachments/assets/c529dc9a-824b-4f50-b487-118a69e30c4d" />


<img width="1080" height="2460" alt="Screenshot_20260606-224114" src="https://github.com/user-attachments/assets/84f46724-7533-45c2-91f5-4e4e8c6175d0" />


https://drive.google.com/file/d/1vBSsBKNL9g609dIjDEqqcv-KqN1NWZ1A/view?usp=sharing
https://drive.google.com/file/d/18M2VBLwBQOwBBzvj_M1a764hneRF2rgM/view?usp=sharing


