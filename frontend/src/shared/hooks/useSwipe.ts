import { useState, useRef, useCallback, useEffect } from "react";

interface UseSwipeableProps {
  threshold?: number;
  maxDrag?: number;
  onClose?: () => void;
  isOpen?: boolean;
};

export const useSwipe = ({
  threshold = 150,
  maxDrag = 150,
  onClose,
  isOpen,
}: UseSwipeableProps = {}) => {
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (!isOpen) {
      setTranslateY(0);
      setIsDragging(false);
    }
  }, [isOpen]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    currentY.current = 0;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;

      const diff = e.touches[0].clientY - startY.current;

      if (diff > 0) {
        const drag = Math.min(diff, maxDrag);
        setTranslateY(drag);
        currentY.current = drag;
      }
    },
    [isDragging, maxDrag],
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    if (currentY.current > threshold) {
      setTranslateY(500);
      setTimeout(() => {
        onClose?.();
        setTranslateY(0);
      }, 200);
    } else {
      setTranslateY(0);
    }

    startY.current = 0;
    currentY.current = 0;
  }, [isDragging, threshold, onClose]);

  return {
    translateY,
    isDragging,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};
