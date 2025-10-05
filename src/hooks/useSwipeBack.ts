import { useRef, useCallback, useState } from 'react';

interface UseSwipeBackOptions {
  onSwipeBack: () => void;
  threshold?: number;
}

export const useSwipeBack = ({ onSwipeBack, threshold = 100 }: UseSwipeBackOptions) => {
  const [swipeProgress, setSwipeProgress] = useState(0);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isSwipingBack = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    startX.current = touch.clientX;
    currentX.current = touch.clientX;
    
    // Only enable swipe-back from left edge
    if (touch.clientX < 50) {
      isSwipingBack.current = true;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwipingBack.current) return;

    const touch = e.touches[0];
    currentX.current = touch.clientX;
    const delta = currentX.current - startX.current;

    if (delta > 0) {
      setSwipeProgress(Math.min(delta / threshold, 1));
    }
  }, [threshold]);

  const handleTouchEnd = useCallback(() => {
    if (!isSwipingBack.current) return;

    const delta = currentX.current - startX.current;
    
    if (delta > threshold) {
      onSwipeBack();
    }
    
    setSwipeProgress(0);
    isSwipingBack.current = false;
  }, [onSwipeBack, threshold]);

  return {
    swipeProgress,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};
