import { useCallback, useRef, type PointerEvent } from "react";

const SNAP_BACK = "transform 280ms cubic-bezier(0.2, 0.9, 0.3, 1.15)";
const DISMISS = "transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1)";

/**
 * Свайп шторки вниз за «ручку»/шапку.
 * - тянем вниз — шторка едет за пальцем, вверх — с сильным сопротивлением;
 * - отпустили дальше ~30% высоты или резким движением — докручиваем вниз
 *   и закрываем; иначе — пружиним обратно.
 * Двигаем style.transform напрямую, без ререндеров на каждый кадр.
 */
export const useSheetDrag = (onDismiss: () => void) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ active: false, startY: 0, startT: 0, dy: 0 });

  const onPointerDown = useCallback((e: PointerEvent<HTMLElement>) => {
    if (e.button !== 0 || !contentRef.current) return;
    // Кнопки в шапке (сброс, закрыть) работают как обычно.
    if ((e.target as HTMLElement).closest("button, a, input")) return;
    drag.current = { active: true, startY: e.clientY, startT: performance.now(), dy: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    contentRef.current.style.transition = "none";
  }, []);

  const onPointerMove = useCallback((e: PointerEvent<HTMLElement>) => {
    const el = contentRef.current;
    if (!drag.current.active || !el) return;
    const raw = e.clientY - drag.current.startY;
    const dy = raw >= 0 ? raw : -Math.sqrt(-raw) * 2;
    drag.current.dy = dy;
    el.style.transform = `translate3d(0, ${dy}px, 0)`;
  }, []);

  const onPointerEnd = useCallback(() => {
    const el = contentRef.current;
    if (!drag.current.active || !el) return;
    const { dy, startT } = drag.current;
    drag.current.active = false;

    const velocity = dy / Math.max(1, performance.now() - startT); // px/ms
    const shouldDismiss = dy > Math.min(160, el.offsetHeight * 0.3) || (velocity > 0.6 && dy > 24);

    if (shouldDismiss) {
      // Докручиваем сами и отключаем keyframe-анимацию закрытия,
      // иначе шторка дёрнется обратно вверх перед исчезновением.
      el.style.transition = DISMISS;
      el.style.transform = `translate3d(0, ${el.offsetHeight + 24}px, 0)`;
      el.style.animation = "none";
      window.setTimeout(onDismiss, 200);
    } else {
      el.style.transition = SNAP_BACK;
      el.style.transform = "";
    }
  }, [onDismiss]);

  return {
    contentRef,
    dragHandleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
      style: { touchAction: "none" as const },
    },
  };
};
