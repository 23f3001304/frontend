/**
 * @module useGsap
 * React hooks that wire GSAP animations to component lifecycles.
 *
 * These thin wrappers ensure tweens are created *after* mount and
 * killed on unmount, preventing memory leaks and stale DOM refs.
 */

import { useEffect, useRef, useCallback, type RefObject } from "react";
import gsap from "gsap";
import {
  fadeSlideIn,
  staggerFadeIn,
  scaleIn,
  clickPop,
  hoverLift,
  modalEnter,
  dropdownEnter,
  staggerRows,
} from "../lib/animations";

/* ─────────────────────────────────────────────
 *  useFadeSlideIn
 * ───────────────────────────────────────────── */

/**
 * Fade-and-slide an element on mount. Cleans up on unmount.
 *
 * @param dir  - Slide direction (`"up"` | `"down"` | `"left"` | `"right"`).
 * @param opts - Extra GSAP tween vars (delay, duration, etc.).
 * @returns A ref to attach to the target element.
 *
 * @example
 * ```tsx
 * const ref = useFadeSlideIn<HTMLDivElement>("up", { delay: 0.2 });
 * return <div ref={ref}>Hello</div>;
 * ```
 */
export function useFadeSlideIn<T extends HTMLElement>(
  dir: "up" | "down" | "left" | "right" = "up",
  opts: gsap.TweenVars = {},
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      fadeSlideIn(ref.current!, dir, opts);
    });
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}

/* ─────────────────────────────────────────────
 *  useStaggerIn
 * ───────────────────────────────────────────── */

/**
 * Stagger-fade children of a container on mount.
 *
 * @param selector - CSS selector for children (default `"> *"`).
 * @param opts     - Extra GSAP tween vars.
 * @returns A ref to attach to the parent container.
 *
 * @example
 * ```tsx
 * const ref = useStaggerIn<HTMLDivElement>("> .card");
 * return <div ref={ref}>{cards.map(...)}</div>;
 * ```
 */
export function useStaggerIn<T extends HTMLElement>(
  selector = "> *",
  opts: gsap.TweenVars = {},
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      staggerFadeIn(ref.current!, selector, opts);
    });
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}

/* ─────────────────────────────────────────────
 *  useScaleIn
 * ───────────────────────────────────────────── */

/**
 * Scale-and-fade an element on mount.
 *
 * @param opts - Extra GSAP tween vars.
 * @returns A ref to attach to the target element.
 */
export function useScaleIn<T extends HTMLElement>(
  opts: gsap.TweenVars = {},
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      scaleIn(ref.current!, opts);
    });
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}

/* ─────────────────────────────────────────────
 *  useClickPop
 * ───────────────────────────────────────────── */

/**
 * Returns an `onMouseDown` handler that plays a quick elastic-pop
 * animation on the target element. Attach it to any clickable element.
 *
 * @returns `{ onMouseDown }` — spread onto the element.
 *
 * @example
 * ```tsx
 * const pop = useClickPop();
 * return <button {...pop}>Click me</button>;
 * ```
 */
export function useClickPop(): {
  onMouseDown: (e: React.MouseEvent<HTMLElement>) => void;
} {
  const onMouseDown = useCallback((e: React.MouseEvent<HTMLElement>) => {
    clickPop(e.currentTarget);
  }, []);

  return { onMouseDown };
}

/* ─────────────────────────────────────────────
 *  useHoverLift
 * ───────────────────────────────────────────── */

/**
 * Returns `onMouseEnter` / `onMouseLeave` handlers that lift
 * the element up with a slight scale on hover, and reverse on leave.
 *
 * @returns Event handlers to spread onto the element.
 *
 * @example
 * ```tsx
 * const hover = useHoverLift();
 * return <div {...hover}>Hover me</div>;
 * ```
 */
export function useHoverLift(): {
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => void;
} {
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const onMouseEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    tweenRef.current?.kill();
    tweenRef.current = hoverLift(e.currentTarget);
  }, []);

  const onMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
    });
  }, []);

  return { onMouseEnter, onMouseLeave };
}

/* ─────────────────────────────────────────────
 *  useModalAnimation
 * ───────────────────────────────────────────── */

/**
 * Animate a modal entrance using backdrop + panel refs.
 * Call on the effect that runs when `isOpen` becomes `true`.
 *
 * @param isOpen - Whether the modal is currently visible.
 * @returns `{ backdropRef, panelRef }` to attach to the modal elements.
 */
export function useModalAnimation<
  B extends HTMLElement = HTMLDivElement,
  P extends HTMLElement = HTMLDivElement,
>(isOpen: boolean): {
  backdropRef: RefObject<B | null>;
  panelRef: RefObject<P | null>;
} {
  const backdropRef = useRef<B>(null);
  const panelRef = useRef<P>(null);

  useEffect(() => {
    if (!isOpen || !backdropRef.current || !panelRef.current) return;
    const ctx = gsap.context(() => {
      modalEnter(backdropRef.current!, panelRef.current!);
    });
    return () => ctx.revert();
  }, [isOpen]);

  return { backdropRef, panelRef };
}

/* ─────────────────────────────────────────────
 *  useDropdownAnimation
 * ───────────────────────────────────────────── */

/**
 * Animate a dropdown menu when it becomes visible.
 *
 * @param isOpen - Whether the dropdown is currently shown.
 * @returns A ref to attach to the dropdown container.
 */
export function useDropdownAnimation<T extends HTMLElement>(
  isOpen: boolean,
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!isOpen || !ref.current) return;
    const ctx = gsap.context(() => {
      dropdownEnter(ref.current!);
    });
    return () => ctx.revert();
  }, [isOpen]);

  return ref;
}

/* ─────────────────────────────────────────────
 *  useStaggerRows
 * ───────────────────────────────────────────── */

/**
 * Re-stagger table/list rows whenever a dependency changes
 * (e.g. `currentPage`, data array length).
 *
 * @param deps     - Dependency array that triggers re-animation.
 * @param selector - Row selector (default `"tr"`).
 * @returns A ref to attach to the container (`<tbody>` or list wrapper).
 */
export function useStaggerRows<T extends HTMLElement>(
  deps: unknown[],
  selector = "tr",
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      staggerRows(ref.current!, selector);
    });
    return () => ctx.revert();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}
