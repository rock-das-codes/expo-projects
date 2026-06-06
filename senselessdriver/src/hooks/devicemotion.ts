import { DeviceMotion } from 'expo-sensors';
import { useEffect, useState } from 'react';

export const useDeviceMotion = () => {
    const isAvailable = DeviceMotion.isAvailableAsync();
    const [data, setData] = useState({ x: 0, y: 0, z: 0 });

    if(!isAvailable){
        return isAvailable;
    }   
    const [subscription, setSubscription] = useState<any>(null);

  const _slow = () => DeviceMotion.setUpdateInterval(1000);
  const _fast = () => DeviceMotion.setUpdateInterval(16);    
  const _subscribe = () => {
    setSubscription(
      DeviceMotion.addListener((event) => {
        if (event && event.acceleration) {
          setData({
            x: event.acceleration.x ?? 0,
            y: event.acceleration.y ?? 0,
            z: event.acceleration.z ?? 0,
          });
        }
      })
    );
  };
  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();   
    return () => _unsubscribe();
  }, []);

  return {
    data,
    slow: _slow,
    fast: _fast,
    subscribe: _subscribe,
    unsubscribe: _unsubscribe,
  };
}