import { useEffect, useRef, useState } from "react";

import { useResizable } from "../hooks/useResizable";
import { selectionEvents } from "../utils/selectionPubSub";
import { overlapDetector } from "../utils/overlapDetector";

import OptionsPanel from "./OptionsPanel";

const Slider = ({
  elementId,
  left,
  top,
  zIndex = 0,
}: {
  elementId: string | null;
  left?: number | string;
  top?: number | string;
  zIndex?: number;
}) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [size, setSize] = useState({ width: 0, height: 400 });
  const [isResizingMode, setIsResizingMode] = useState<boolean>(false);

  const elementRef = useRef<HTMLDivElement | null>(null);
  useResizable(elementRef, (s) => setSize(s), isResizingMode);

  const handleDragEnter = () => {
    if (!elementRef.current?.classList.contains("hidden"))
      elementRef.current?.classList.add("dragging-over");
  };
  const handleDragLeave = (e: React.DragEvent) => {
    if (e.target === elementRef.current)
      elementRef.current?.classList.remove("dragging-over");
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (elementRef.current) {
      elementRef.current.classList.add("hidden");
      const pos = { x: e.clientX, y: e.clientY };
      const selfRect = elementRef.current.getBoundingClientRect();
      const offsetX = -pos.x + selfRect.left;
      const offsetY = -pos.y + selfRect.top;

      e.dataTransfer.setData(
        "elementData",
        JSON.stringify({
          elementId,
          type: "slider",
          offsetX,
          offsetY,
        })
      );

      const preview = document.getElementById("preview") as HTMLElement | null;
      if (preview) {
        overlapDetector.beginDragExisting(preview, {
          element: elementRef.current,
          offsetX,
          offsetY,
          width: elementRef.current.offsetWidth,
          height: elementRef.current.offsetHeight,
        });
      }
    }
  };

  useEffect(() => {
    const handler = (newId: string | null) => {
      setIsSelected(newId === elementId);
    };
    const unsub = selectionEvents.subscribe(handler);
    return () => {
      unsub();
    };
  }, [elementId]);
  return (
    <div
      className="slider"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      data-element-id={elementId}
      draggable={isSelected && !isResizingMode}
      onDragStart={handleDragStart}
      onDragEnd={() => {
        elementRef.current?.classList.remove("hidden");
        overlapDetector.end();
      }}
      ref={elementRef}
      onClick={() => selectionEvents.publish(elementId)}
      style={{
        height: size.height + "px",
        left: left ?? undefined,
        top: top ?? undefined,
        zIndex,
      }}
    >
      <OptionsPanel
        elementId={elementId}
        elementRef={elementRef}
        isSelected={isSelected}
        zIndex={zIndex}
        isResizingMode={isResizingMode}
        toggleResizingMode={() => setIsResizingMode((v) => !v)}
        allowedHandles={[
          "top-left",
          "top",
          "top-right",
          "right",
          "bottom-right",
          "bottom",
          "bottom-left",
          "left",
        ]}
      >
        Slider
      </OptionsPanel>
    </div>
  );
};

export default Slider;
