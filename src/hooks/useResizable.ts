import { useRef, useEffect, type RefObject } from "react";
import { overlapDetector } from "../utils/overlapDetector";

interface Size {
  width: number;
  height: number;
}

/**
 * Attaches pointer handlers to existing .resize-handle elements inside the given elementRef.
 * Live resizing manipulates the element's inline width/height (no React state during drag).
 * When the gesture ends, onCommit is called with final size (so React state can be updated).
 *
 * The hook is passive by default; the caller can pass `isActive` to enable resizing behavior.
 *
 * Handles should exist in DOM and have class names:
 *   - "resize-handle horizontal"  -> resize width only
 *   - "resize-handle vertical"    -> resize height only
 *   - "resize-handle both"        -> resize while preserving aspect ratio (based on start size)
 */
export function useResizable(
  elementRef: RefObject<HTMLElement | null>,
  onCommit: (size: Size) => void,
  isActive = false
) {
  const startX = useRef(0);
  const startY = useRef(0);
  const startW = useRef(0);
  const startH = useRef(0);
  const handleType = useRef<"vertical" | "horizontal" | "both" | null>(null);
  const aspectRatio = useRef(1);

  const onMove = (e: PointerEvent) => {
    const el = elementRef.current;
    if (!el) return;
    if (!handleType.current) return;

    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;

    let newW = startW.current;
    let newH = startH.current;

    if (handleType.current === "horizontal") {
      newW = Math.max(20, Math.round(startW.current + dx));
      // height unchanged
    } else if (handleType.current === "vertical") {
      newH = Math.max(20, Math.round(startH.current + dy));
      // width unchanged
    } else if (handleType.current === "both") {
      // preserve aspect ratio based on horizontal movement (dx)
      const tentativeW = Math.max(20, Math.round(startW.current + dx));
      newW = tentativeW;
      newH = Math.max(20, Math.round(tentativeW / aspectRatio.current));
    }

    el.style.width = newW + "px";
    el.style.height = newH + "px";
    // overlap detection during resizing (highlight static overlapping elements)
    overlapDetector.onResizeMoveRect(el.getBoundingClientRect());
  };

  const onUp = () => {
    const el = elementRef.current;
    if (el) {
      onCommit({
        width: el.offsetWidth,
        height: el.offsetHeight,
      });
    }
    // end overlap highlighting when resize ends
    overlapDetector.end();

    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };

  const onDown = (e: PointerEvent) => {
    // Only start resizing if the parent/consumer enabled resizing mode
    if (!isActive) return;

    e.preventDefault();
    const target = e.target as Element | null;
    const el = elementRef.current;
    if (!el || !target) return;

    // determine handle type from classes
    if (target.classList.contains("horizontal")) {
      handleType.current = "horizontal";
    } else if (target.classList.contains("vertical")) {
      handleType.current = "vertical";
    } else if (target.classList.contains("both")) {
      handleType.current = "both";
    } else {
      handleType.current = null;
      return;
    }

    // initialize overlap detection for resize against other children in #preview
    const preview = document.getElementById("preview") as HTMLElement | null;
    if (preview) {
      overlapDetector.beginResize(preview, el);
    }

    startX.current = e.clientX;
    startY.current = e.clientY;
    startW.current = el.offsetWidth;
    startH.current = el.offsetHeight;
    aspectRatio.current = Math.max(
      1e-6,
      startW.current / Math.max(1, startH.current)
    );

    // pointer capture if available for smoother drag
    try {
      (target as Element).setPointerCapture?.(e.pointerId);
    } catch {
      // ignore if not available
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // ensure parent positioning for absolute handles to work
    if (!el.style.position) {
      // preserve existing inline style if set; otherwise set absolute
      el.style.position = el.style.position || "absolute";
    }

    const handles: HTMLElement[] = Array.from(
      el.querySelectorAll(".resize-handle")
    );

    // attach pointerdown to each existing handle
    handles.forEach((h) => h.addEventListener("pointerdown", onDown));

    return () => {
      handles.forEach((h) => h.removeEventListener("pointerdown", onDown));
    };
    // isActive intentionally included so enabling/disabling resizing updates behavior
  }, [elementRef, isActive, onCommit]);
}
