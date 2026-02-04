import { useState, useEffect, useRef } from "react";

export interface IPosition {
  x: number;
  y: number;
}

export interface IComponent {
  width: number;
  height: number;
}

export interface ILazyComponent extends IPosition, IComponent {
  isInViewport: boolean;
}

export function useElementPosition(
  threshold: number = 100
): [React.RefObject<HTMLDivElement | null>, ILazyComponent] {
  const [position, setPosition] = useState<ILazyComponent>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    isInViewport: false,
  });

  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const updatePosition = () => {
      const rect = element.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;

      const viewportHeight = window.innerHeight;
      const isInViewport = rect.top <= viewportHeight - threshold;

      setPosition({
        x: rect.left + scrollX,
        y: rect.top + scrollY,
        width: rect.width,
        height: rect.height,
        isInViewport,
      });
    };

    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);

    updatePosition();

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [threshold]);

  return [elementRef, position];
}