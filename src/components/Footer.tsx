import { useEffect, useRef, useState } from "react";

import { selectionEvents } from "../utils/selectionPubSub";
import { useResizable } from "../hooks/useResizable";

import OptionsPanel from "./OptionsPanel";

const Footer = ({ elementId }: { elementId: string | null }) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isResizingMode, setIsResizingMode] = useState<boolean>(false);
  const [size, setSize] = useState({ width: 0, height: 60 });

  const elementRef = useRef<HTMLElement | null>(null);

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
        border: "2px solid black",
        position: "absolute",
        width: "100%",
        height: size.height + "px",
        bottom: 0,
      }}
    >
      <OptionsPanel
        elementId={elementId}
        elementRef={elementRef}
        isSelected={isSelected}
        zIndex={0}
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
