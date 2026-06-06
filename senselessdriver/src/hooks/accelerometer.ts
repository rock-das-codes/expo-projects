import { Accelerometer } from 'expo-sensors';
import { useEffect, useState } from 'react';


export const useAccelerometer = () => {
    const isAvailable = Accelerometer.isAvailableAsync();
    const [data, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });

    if(!isAvailable){
        return isAvailable;
    }
    const [subscription, setSubscription] = useState<any>(null);

  const _slow = () => Accelerometer.setUpdateInterval(1000);
  const _fast = () => Accelerometer.setUpdateInterval(16);

  const _subscribe = () => {
    setSubscription(Accelerometer.addListener(setData));
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
};
