import { useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'heavy' | 'selection' | 'impactLight' | 'impactMedium' | 'impactHeavy' | 'notificationSuccess' | 'notificationWarning' | 'notificationError';

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((type: HapticType = 'light') => {
    // Check if device supports haptics (mobile devices)
    if (navigator.vibrate) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
        selection: [5],
        impactLight: [10],
        impactMedium: [15],
        impactHeavy: [25],
        notificationSuccess: [10, 50, 10],
        notificationWarning: [15, 100, 15],
        notificationError: [20, 150, 20]
      };
      
      navigator.vibrate(patterns[type] || patterns.light);
    }
  }, []);

  return { triggerHaptic };
};