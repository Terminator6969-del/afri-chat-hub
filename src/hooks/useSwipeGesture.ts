import { useState, useRef, useCallback } from 'react';

export interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export const useSwipeGesture = (handlers: SwipeHandlers, threshold = 50) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const isSwipe = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    currentX.current = startX.current;
    currentY.current = startY.current;
    isSwipe.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwipe.current) {
      const diffX = Math.abs(e.touches[0].clientX - startX.current);
      const diffY = Math.abs(e.touches[0].clientY - startY.current);
      
      if (diffX > 10 || diffY > 10) {
        isSwipe.current = true;
      }
    }

    if (isSwipe.current) {
      currentX.current = e.touches[0].clientX;
      currentY.current = e.touches[0].clientY;
      
      const deltaX = currentX.current - startX.current;
      setSwipeOffset(deltaX);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isSwipe.current) return;

    const deltaX = currentX.current - startX.current;
    const deltaY = currentY.current - startY.current;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
      if (deltaX > 0) {
        handlers.onSwipeRight?.();
      } else {
        handlers.onSwipeLeft?.();
      }
    } else if (absDeltaY > threshold) {
      if (deltaY > 0) {
        handlers.onSwipeDown?.();
      } else {
        handlers.onSwipeUp?.();
      }
    }

    setSwipeOffset(0);
    isSwipe.current = false;
  }, [handlers, threshold]);

  return {
    swipeOffset,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    }
  };
};