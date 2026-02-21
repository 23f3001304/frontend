/**
 * @module useDropdown
 * Manages open/close state for dropdown menus and popups.
 */

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Hook to manage a dropdown/popup that closes when clicking outside.
 *
 * @returns An object with:
 *  - `isOpen` — current visibility state.
 *  - `toggle` — flip open ↔ closed.
 *  - `close`  — force-close the dropdown.
 *  - `ref`    — attach to the outer wrapper for outside-click detection.
 *
 * @example
 * ```tsx
 * const menu = useDropdown();
 * return (
 *   <div ref={menu.ref}>
 *     <button onClick={menu.toggle}>Open</button>
 *     {menu.isOpen && <DropdownList />}
 *   </div>
 * );
 * ```
 */
export function useDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return { isOpen, toggle, close, ref };
}
