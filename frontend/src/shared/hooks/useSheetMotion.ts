import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";

/** Кривая как у системных шторок iOS — мягкий старт, плавный «доезд». */
export const SHEET_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

const DISMISS_RATIO = 0.3; // протянули дальше 30% высоты — закрываем
const FLICK_VELOCITY = 0.45; // px/мс — резкий жест закрывает даже коротким движением
const SAMPLE_WINDOW = 80; // мс — скорость считаем по последним сэмплам

type Sample = { y: number; t: number };

/**
 * Плавное перетаскивание нижней шторки:
 * - transform пишется через requestAnimationFrame, без ререндеров React;
 * - скорость — по последним ~80 мс движения, а не по всему жесту;
 * - затемнение фона следует за пальцем;
 * - тянуть можно за шапку и за содержимое, если оно прокручено до верха;
 * - докрут/возврат — с длительностью от скорости жеста.
 */
export const useSheetMotion = (onDismiss: () => void) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const state = useRef({ active: false, startY: 0, dy: 0, samples: [] as Sample[], frame: 0 });

  const overlay = () =>
    contentRef.current?.parentElement?.querySelector<HTMLElement>("[data-slot=sheet-overlay]") ??
    (contentRef.current?.previousElementSibling as HTMLElement | null);

  const paint = useCallback(() => {
    state.current.frame = 0;
    const el = contentRef.current;
    if (!el) return;
    const { dy } = state.current;
    el.style.transform = `translate3d(0, ${dy}px, 0)`;
    const o = overlay();
    if (o) o.style.opacity = String(Math.max(0, 1 - Math.max(0, dy) / (el.offsetHeight * 1.1)));
  }, []);

  const begin = useCallback((y: number) => {
    const el = contentRef.current;
    if (!el) return false;
    state.current.active = true;
    state.current.startY = y;
    state.current.dy = 0;
    state.current.samples = [{ y, t: performance.now() }];
    el.style.transition = "none";
    el.style.willChange = "transform";
    const o = overlay();
    if (o) o.style.transition = "none";
    return true;
  }, []);

  const move = useCallback(
    (y: number) => {
      const s = state.current;
      if (!s.active) return;
      const raw = y - s.startY;
      // Вверх — резиновое сопротивление, вниз — 1:1 с пальцем.
      s.dy = raw >= 0 ? raw : -Math.sqrt(-raw) * 2.5;
      const now = performance.now();
      s.samples.push({ y, t: now });
      while (s.samples.length > 2 && now - s.samples[0].t > SAMPLE_WINDOW) s.samples.shift();
      if (!s.frame) s.frame = requestAnimationFrame(paint);
    },
    [paint],
  );

  const end = useCallback(() => {
    const s = state.current;
    const el = contentRef.current;
    if (!s.active || !el) return;
    s.active = false;
    if (s.frame) cancelAnimationFrame(s.frame), (s.frame = 0);

    const first = s.samples[0];
    const last = s.samples[s.samples.length - 1];
    const velocity = last && first && last.t > first.t ? (last.y - first.y) / (last.t - first.t) : 0;
    const height = el.offsetHeight;
    const dismiss = s.dy > height * DISMISS_RATIO || (velocity > FLICK_VELOCITY && s.dy > 12);
    const o = overlay();

    if (dismiss) {
      const remaining = height - s.dy + 24;
      const duration = Math.min(320, Math.max(140, remaining / Math.max(velocity, 1.4)));
      el.style.transition = `transform ${duration}ms cubic-bezier(0.2, 0.6, 0.35, 1)`;
      el.style.transform = `translate3d(0, ${height + 24}px, 0)`;
      // Своя докрутка уже идёт — keyframe закрытия не нужен (иначе дёрнется вверх).
      el.style.animation = "none";
      if (o) {
        o.style.transition = `opacity ${duration}ms linear`;
        o.style.opacity = "0";
      }
      window.setTimeout(onDismiss, duration - 20);
    } else {
      el.style.transition = `transform 420ms ${SHEET_EASE}`;
      el.style.transform = "translate3d(0, 0, 0)";
      if (o) {
        o.style.transition = `opacity 420ms ${SHEET_EASE}`;
        o.style.opacity = "";
      }
      window.setTimeout(() => el && (el.style.willChange = ""), 440);
    }
  }, [onDismiss]);

  // Шапка/ручка: pointer-события (мышь и палец), touch-action: none.
  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (e.button !== 0) return;
      if ((e.target as HTMLElement).closest("button, a, input, textarea")) return;
      if (!begin(e.clientY)) return;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // синтетические события без активного указателя
      }
    },
    [begin],
  );

  // Содержимое: тянем вниз только от верхнего края прокрутки — touch-события,
  // чтобы можно было отменить нативный скролл (preventDefault).
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    let startY = 0;
    let armed = false;

    const onStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      // Зоны со своими жестами (ряд звёзд и т.п.) шторку не тянут.
      const own = (e.target as HTMLElement).closest("[data-sheet-no-drag]");
      armed = !own && body.scrollTop <= 0;
    };
    const onMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      if (!state.current.active) {
        if (!armed || y - startY < 6 || body.scrollTop > 0) return;
        begin(startY);
      }
      e.preventDefault();
      move(y);
    };
    const onEnd = () => {
      armed = false;
      end();
    };

    body.addEventListener("touchstart", onStart, { passive: true });
    body.addEventListener("touchmove", onMove, { passive: false });
    body.addEventListener("touchend", onEnd);
    body.addEventListener("touchcancel", onEnd);
    return () => {
      body.removeEventListener("touchstart", onStart);
      body.removeEventListener("touchmove", onMove);
      body.removeEventListener("touchend", onEnd);
      body.removeEventListener("touchcancel", onEnd);
    };
  }, [begin, move, end]);

  return {
    contentRef,
    bodyRef,
    dragHandleProps: {
      onPointerDown,
      onPointerMove: (e: ReactPointerEvent<HTMLElement>) => move(e.clientY),
      onPointerUp: end,
      onPointerCancel: end,
      style: { touchAction: "none" as const },
    },
  };
};
