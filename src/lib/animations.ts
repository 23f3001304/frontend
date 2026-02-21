/**
 * @module animations
 * Centralised GSAP animation presets for the Fleet Flow dashboard.
 *
 * Every public function returns the `gsap.core.Tween` (or `Timeline`)
 * so callers can `.kill()` / `.reverse()` in cleanup effects.
 *
 * Usage:
 * ```ts
 * import { fadeSlideIn, clickPop } from "@/lib/animations";
 * useEffect(() => { const tw = fadeSlideIn(ref.current!); return () => tw.kill(); }, []);
 * ```
 */

import gsap from "gsap";

/* ─────────────────────────────────────────────
 *  ENTRANCE  –  elements appearing on screen
 * ───────────────────────────────────────────── */

/**
 * Fade-and-slide an element in from a given direction.
 *
 * @param el     - Target DOM element.
 * @param dir    - Slide direction (`"up"` | `"down"` | `"left"` | `"right"`).
 * @param opts   - Optional overrides merged into the tween.
 * @returns The GSAP tween for cleanup.
 */
export function fadeSlideIn(
  el: Element,
  dir: "up" | "down" | "left" | "right" = "up",
  opts: gsap.TweenVars = {},
): gsap.core.Tween {
  const axisMap = { up: { y: 16 }, down: { y: -16 }, left: { x: 16 }, right: { x: -16 } };
  return gsap.from(el, {
    opacity: 0,
    duration: 0.3,
    ease: "power3.out",
    force3D: true,
    ...axisMap[dir],
    ...opts,
  });
}

/**
 * Stagger-fade a list of child elements into view.
 *
 * @param parent   - The container whose direct children are animated.
 * @param selector - CSS selector for children (default `"> *"`).
 * @param opts     - Optional overrides merged into the tween.
 * @returns The GSAP tween for cleanup.
 */
export function staggerFadeIn(
  parent: Element,
  selector = ":scope > *",
  opts: gsap.TweenVars = {},
): gsap.core.Tween {
  const safeSelector = selector.startsWith(">") ? `:scope ${selector}` : selector;
  const targets = parent.querySelectorAll(safeSelector);
  gsap.set(targets, { clearProps: "opacity,transform" });
  return gsap.from(targets, {
    opacity: 0,
    y: 10,
    duration: 0.25,
    ease: "power2.out",
    stagger: 0.04,
    force3D: true,
    clearProps: "opacity,transform",
    ...opts,
  });
}

/**
 * Scale-and-fade an element in from small.
 *
 * @param el   - Target DOM element.
 * @param opts - Optional overrides.
 * @returns The GSAP tween for cleanup.
 */
export function scaleIn(
  el: Element,
  opts: gsap.TweenVars = {},
): gsap.core.Tween {
  return gsap.from(el, {
    opacity: 0,
    scale: 0.92,
    duration: 0.2,
    ease: "back.out(1.4)",
    force3D: true,
    ...opts,
  });
}

/* ─────────────────────────────────────────────
 *  EXIT  –  elements leaving the screen
 * ───────────────────────────────────────────── */

/**
 * Fade-and-scale an element out.
 *
 * @param el   - Target DOM element.
 * @param opts - Optional overrides.
 * @returns The GSAP tween for cleanup.
 */
export function scaleOut(
  el: Element,
  opts: gsap.TweenVars = {},
): gsap.core.Tween {
  return gsap.to(el, {
    opacity: 0,
    scale: 0.95,
    duration: 0.15,
    ease: "power2.in",
    force3D: true,
    ...opts,
  });
}

/* ─────────────────────────────────────────────
 *  INTERACTION  –  micro-feedback on user input
 * ───────────────────────────────────────────── */

/**
 * Quick "pop" on click – scales the element down then back up.
 * Pair with `onMouseDown` for the snappiest feel.
 *
 * @param el   - Target DOM element.
 * @param opts - Optional overrides (e.g. different scale depth).
 * @returns The GSAP tween for cleanup.
 */
export function clickPop(
  el: Element,
  opts: gsap.TweenVars = {},
): gsap.core.Tween {
  return gsap.fromTo(
    el,
    { scale: 0.93 },
    { scale: 1, duration: 0.2, ease: "elastic.out(1, 0.4)", force3D: true, ...opts },
  );
}

/**
 * Subtle hover lift – nudge element up with a box-shadow tweak.
 * Returns a tween you should `.reverse()` on mouse-leave.
 *
 * @param el   - Target DOM element.
 * @param opts - Optional overrides.
 * @returns The GSAP tween for cleanup.
 */
export function hoverLift(
  el: Element,
  opts: gsap.TweenVars = {},
): gsap.core.Tween {
  return gsap.to(el, {
    y: -3,
    scale: 1.015,
    duration: 0.15,
    ease: "power2.out",
    force3D: true,
    ...opts,
  });
}

/* ─────────────────────────────────────────────
 *  MODALS / OVERLAYS
 * ───────────────────────────────────────────── */

/**
 * Animate a modal panel entrance (backdrop + panel).
 *
 * @param backdrop - The backdrop overlay element.
 * @param panel    - The modal content element.
 * @returns A GSAP Timeline for cleanup.
 */
export function modalEnter(
  backdrop: Element,
  panel: Element,
): gsap.core.Timeline {
  const tl = gsap.timeline();
  tl.from(backdrop, { opacity: 0, duration: 0.15, ease: "power2.out" })
    .from(
      panel,
      { opacity: 0, scale: 0.92, y: 20, duration: 0.2, ease: "back.out(1.4)", force3D: true },
      "<0.05",
    );
  return tl;
}

/**
 * Animate a dropdown menu opening with staggered items.
 *
 * @param el - The dropdown container element.
 * @returns The GSAP tween for cleanup.
 */
export function dropdownEnter(
  el: Element,
): gsap.core.Tween {
  gsap.set(el, { opacity: 1 });
  return gsap.from(el, {
    opacity: 0,
    y: -4,
    scale: 0.96,
    duration: 0.12,
    ease: "power2.out",
    force3D: true,
  });
}

/* ─────────────────────────────────────────────
 *  TABLE / LIST ROWS
 * ───────────────────────────────────────────── */

/**
 * Stagger table rows in (useful after pagination or data load).
 *
 * @param container - The `<tbody>` or list container.
 * @param selector  - CSS selector for individual rows (default `"tr"`).
 * @param opts      - Optional overrides.
 * @returns The GSAP tween for cleanup.
 */
export function staggerRows(
  container: Element,
  selector = "tr",
  opts: gsap.TweenVars = {},
): gsap.core.Tween {
  const safeSelector = selector.startsWith(">") ? `:scope ${selector}` : selector;
  const targets = container.querySelectorAll(safeSelector);
  // Clear any leftover inline styles from a previous run so
  // CSS hover / transitions work cleanly after the animation.
  gsap.set(targets, { clearProps: "opacity,transform" });
  return gsap.from(targets, {
    opacity: 0,
    x: -8,
    duration: 0.2,
    ease: "power2.out",
    stagger: 0.03,
    force3D: true,
    clearProps: "opacity,transform",
    ...opts,
  });
}

/* ─────────────────────────────────────────────
 *  PROGRESS / VALUE COUNTERS
 * ───────────────────────────────────────────── */

/**
 * Animate a progress bar width from 0 to its target.
 *
 * @param el   - The inner progress-bar element.
 * @param pct  - Target width percentage (0-100).
 * @param opts - Optional overrides.
 * @returns The GSAP tween for cleanup.
 */
export function animateProgress(
  el: Element,
  pct: number,
  opts: gsap.TweenVars = {},
): gsap.core.Tween {
  return gsap.fromTo(
    el,
    { width: "0%" },
    { width: `${pct}%`, duration: 0.8, ease: "power2.out", ...opts },
  );
}

/**
 * Count-up a numeric display from 0 to target.
 *
 * @param el     -  The element whose `textContent` will be updated.
 * @param target -  The target number to count to.
 * @param opts   -  Optional overrides.
 * @returns The GSAP tween for cleanup.
 */
export function countUp(
  el: Element,
  target: number,
  opts: gsap.TweenVars = {},
): gsap.core.Tween {
  const obj = { val: 0 };
  return gsap.to(obj, {
    val: target,
    duration: 1,
    ease: "power2.out",
    onUpdate: () => {
      (el as HTMLElement).textContent = Math.round(obj.val).toLocaleString();
    },
    ...opts,
  });
}
