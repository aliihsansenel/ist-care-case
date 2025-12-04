import { useContext, type RefObject } from "react";

import { ElementOperationsContext } from "./contexts";

import "./style/preview.css";

type OptionsPanelProps<T extends HTMLElement = HTMLElement> = {
  children: React.ReactNode;
  elementId: string | null;
  elementRef: RefObject<T | null>;
  isSelected: boolean;
  zIndex: number;
};

const OptionsPanel = <T extends HTMLElement = HTMLElement>({
  children,
  elementId,
  elementRef,
  isSelected,
  zIndex,
}: OptionsPanelProps<T>) => {
  const { zIndexLimits, zIndexChange, deleteElement } = useContext(
    ElementOperationsContext
  );
  void elementRef;

  return (
    <div className="options-panel-cont" style={{}}>
      <div
        className="options-panel"
        style={{
          visibility: isSelected ? "visible" : "hidden",
        }}
      >
        <button
          disabled={zIndexLimits.bottom === zIndex}
          onClick={() => zIndexChange(elementId, -1)}
        >
          Back
        </button>
        <button
          disabled={zIndexLimits.top === zIndex}
          onClick={() => zIndexChange(elementId, 1)}
        >
          Front
        </button>
        <button onClick={() => deleteElement(elementId)}>Delete</button>
      </div>
      {children}
    </div>
  );
};

export default OptionsPanel;
