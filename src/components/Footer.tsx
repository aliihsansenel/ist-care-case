import { useEffect, useRef, useState } from "react";

import { selectionEvents } from "../utils/selectionPubSub";
import { useResizable } from "../hooks/useResizable";

import OptionsPanel from "./OptionsPanel";

const Footer = ({
  elementId,
  zIndex = 0,
}: {
  elementId: string | null;
  zIndex?: number;
  left?: number | string;
  top?: number | string;
}) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isResizingMode, setIsResizingMode] = useState<boolean>(false);
  const [size, setSize] = useState({ width: 0, height: 60 });

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
    <footer
      className="footer"
      ref={elementRef}
      data-element-id={elementId}
      onClick={() => selectionEvents.publish(elementId)}
      style={{
        height: size.height + "px",
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
        allowedHandles={["top"]}
      >
        Footer
      </OptionsPanel>
    </footer>
  );
};

export default Footer;
