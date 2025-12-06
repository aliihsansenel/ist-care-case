import { useEffect, useRef, useState } from "react";
import OptionsPanel from "./OptionsPanel";
import { selectionEvents } from "../utils/selectionPubSub";
import { useResizable } from "../hooks/useResizable";

const Header = ({
  elementId,
  zIndex,
}: {
  elementId: string | null;
  zIndex: number;
}) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isResizingMode, setIsResizingMode] = useState<boolean>(false);
  const [size, setSize] = useState({ width: 0, height: 80 });

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
    <header
      className="header"
      ref={elementRef}
      data-element-id={elementId}
      onClick={() => selectionEvents.publish(elementId)}
      style={{
        border: "2px solid black",
        position: "sticky",
        width: "100%",
        height: size.height + "px",
        top: 0,
      }}
    >
      <OptionsPanel
        elementId={elementId}
        elementRef={elementRef}
        isSelected={isSelected}
        zIndex={zIndex}
        isResizingMode={isResizingMode}
        toggleResizingMode={() => setIsResizingMode((v) => !v)}
      >
        Header
      </OptionsPanel>
    </header>
  );
};

export default Header;
