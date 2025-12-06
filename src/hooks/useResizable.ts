import { useRef, useEffect, type RefObject } from "react";

import { overlapDetector } from "../utils/overlapDetector";

interface Size {
  width: number;
  height: number;
}

/**
 * Extended resizer:
 * - Supports directional handles: left, right, top, bottom and the 4 corners (top-left, top-right, bottom-left, bottom-right)
 * - Preserves original behaviour for "horizontal", "vertical", and "both" (both behaves like bottom-right with aspect ratio preservation)
 *
 * Note: onCommit still only returns final size (width/height) to keep the original contract.
 * The hook will manipulate inline left/top during drag so the element visually moves when resizing from left/top.
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
  const startLeft = useRef(0);
  const startTop = useRef(0);

  const handleType = useRef<
    | "vertical"
    | "horizontal"
    | "both"
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | null
  >(null);

  const aspectRatio = useRef(1);

  const onMove = (e: PointerEvent) => {
    const el = elementRef.current;
    if (!el) return;
    if (!handleType.current) return;

    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;

    const minSize = 20;

    let newW = startW.current;
    let newH = startH.current;
    let newLeft = startLeft.current;
    let newTop = startTop.current;

    switch (handleType.current) {
      case "horizontal":
      case "right":
        newW = Math.max(minSize, Math.round(startW.current + dx));
        break;

      case "left":
        // dragging left handle: width decreases when moving right (dx>0)
        newW = Math.max(minSize, Math.round(startW.current - dx));
        newLeft = Math.round(startLeft.current + dx);
        break;

      case "vertical":
      case "bottom":
        newH = Math.max(minSize, Math.round(startH.current + dy));
        break;

      case "top":
        newH = Math.max(minSize, Math.round(startH.current - dy));
        newTop = Math.round(startTop.current + dy);
        break;

      case "both":
      case "bottom-right":
        // preserve aspect ratio using horizontal movement (legacy behaviour)
        {
          const tentativeW = Math.max(minSize, Math.round(startW.current + dx));
          newW = tentativeW;
          newH = Math.max(
            minSize,
            Math.round(tentativeW / aspectRatio.current)
          );
        }
        break;

      case "top-left":
        newW = Math.max(minSize, Math.round(startW.current - dx));
        newH = Math.max(minSize, Math.round(startH.current - dy));
        newLeft = Math.round(startLeft.current + dx);
        newTop = Math.round(startTop.current + dy);
        break;

      case "top-right":
        newW = Math.max(minSize, Math.round(startW.current + dx));
        newH = Math.max(minSize, Math.round(startH.current - dy));
        newTop = Math.round(startTop.current + dy);
        break;

      case "bottom-left":
        newW = Math.max(minSize, Math.round(startW.current - dx));
        newH = Math.max(minSize, Math.round(startH.current + dy));
        newLeft = Math.round(startLeft.current + dx);
        break;

      default:
        break;
    }

    // apply inline styles (width/height and if needed, left/top)
    el.style.width = newW + "px";
    el.style.height = newH + "px";
    // update positional styles only when they changed (so anchored corners work)
    if (newLeft !== startLeft.current) {
      el.style.left = newLeft + "px";
    }
    if (newTop !== startTop.current) {
      el.style.top = newTop + "px";
    }

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

    // determine handle type from classes - support both legacy class names
    const cls = target.classList;
    if (cls.contains("left")) {
      handleType.current = "left";
    } else if (cls.contains("right")) {
      handleType.current = "right";
    } else if (cls.contains("top")) {
      handleType.current = "top";
    } else if (cls.contains("bottom")) {
      handleType.current = "bottom";
    } else if (cls.contains("top-left")) {
      handleType.current = "top-left";
    } else if (cls.contains("top-right")) {
      handleType.current = "top-right";
    } else if (cls.contains("bottom-left")) {
      handleType.current = "bottom-left";
    } else if (cls.contains("bottom-right")) {
      handleType.current = "bottom-right";
    } else if (cls.contains("horizontal")) {
      handleType.current = "horizontal";
    } else if (cls.contains("vertical")) {
      handleType.current = "vertical";
    } else if (cls.contains("both")) {
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

    // store starting position relative to offsetParent (used when resizing from left/top)
    startLeft.current = el.offsetLeft;
    startTop.current = el.offsetTop;

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
