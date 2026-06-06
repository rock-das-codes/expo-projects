import { useAccelerometer } from './accelerometer';

import { useEffect, useState } from 'react';
import { useDeviceMotion } from './devicemotion';
import { useGyroscope } from './gyroscope';


const acelerometerThreshold = 3; 


const gyroscopeThreshold = 10; 


const deviceMotionThreshold = 40;
export const useDrivingEval = (start: boolean) => {

    const [accelSubscription, setAccelSubscription] = useState(null);
    const [gyroSubscription, setGyroSubscription] = useState(null);
const { data: accelData, subscribe: AccelerometerSubscribe, unsubscribe: AccelerometerUnsubscribe } = useAccelerometer();
const { data: gyroData, subscribe: GyroscopeSubscribe, unsubscribe: GyroscopeUnsubscribe } = useGyroscope();
const { data: deviceMOtionData, subscribe: DeviceMotionSubscribe, unsubscribe: DeviceMotionUnsubscribe } = useDeviceMotion();
    useEffect(() => {
        if (start) {
            AccelerometerSubscribe();
            GyroscopeSubscribe();
            DeviceMotionSubscribe();
        } else {
            AccelerometerUnsubscribe();
            GyroscopeUnsubscribe();
            DeviceMotionUnsubscribe();
        }

       
        return () => {
            AccelerometerUnsubscribe();
            GyroscopeUnsubscribe();
            DeviceMotionUnsubscribe();
        };
    }, [start]);
    const acc = accelData || { x: 0, y: 0, z: 0 };
    const gyro = gyroData || { x: 0, y: 0, z: 0 };
    const motion = deviceMOtionData || { x: 0, y: 0, z: 0 };
    const accMag = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
    
    // If total force exceeds ~1.35G, it's a harsh driving event.
    const harshAcceleration = accMag > acelerometerThreshold;
    
    // Differentiating braking vs acceleration requires orientation calibration. 
    // As a heuristic, if we hit the high-G threshold and Y or Z tilts forward negatively, it's a brake.
    const harshBraking = accMag > acelerometerThreshold && (acc.y < -0.2 || acc.z < -0.2);
    
    const sharpTurn = Math.sqrt(
        gyro.x * gyro.x + gyro.y * gyro.y + gyro.z * gyro.z
    ) > gyroscopeThreshold;
    const AggressiveSteering = Math.abs(gyro.y) > gyroscopeThreshold || Math.abs(gyro.z) > gyroscopeThreshold;

    const excessiveDeviceMotion = Math.sqrt(
        motion.x * motion.x + motion.y * motion.y + motion.z * motion.z
    ) > deviceMotionThreshold;
    const phoneUseWhileDriving = excessiveDeviceMotion; // This is a simplification, you may want to refine this logic

    return {
        harshAcceleration,
        harshBraking,
        sharpTurn,
        AggressiveSteering,
        phoneUseWhileDriving,
    };
}