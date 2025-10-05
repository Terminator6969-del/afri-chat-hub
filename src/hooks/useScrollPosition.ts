import { useEffect, useRef } from 'react';

export const useScrollPosition = (key: string) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const positionKey = `scroll-position-${key}`;

  useEffect(() => {
    const savedPosition = sessionStorage.getItem(positionKey);
    if (savedPosition && scrollRef.current) {
      scrollRef.current.scrollTop = parseInt(savedPosition, 10);
    }
  }, [positionKey]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      sessionStorage.setItem(positionKey, container.scrollTop.toString());
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [positionKey]);

  return scrollRef;
};
