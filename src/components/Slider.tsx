import { useEffect, useRef, useState } from "react";

import { useResizable } from "../hooks/useResizable";
import { selectionEvents } from "../utils/selectionPubSub";

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
      ref={elementRef}
      data-element-id={elementId}
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
