import { useContext, type RefObject } from "react";

import { ElementOperationsContext } from "./contexts";

import "./style/preview.css";

type OptionsPanelProps<T extends HTMLElement = HTMLElement> = {
  children: React.ReactNode;
  elementId: string | null;
  elementRef: RefObject<T | null>;
  isSelected: boolean;
  zIndex: number;
  // optional props to control resizing mode from parent (Card)
  isResizingMode?: boolean;
  toggleResizingMode?: () => void;
  // allowedHandles: list of handle identifiers to render for this element
  // valid values: "left","right","top","bottom","top-left","top-right","bottom-left","bottom-right","horizontal","vertical","both"
  allowedHandles?: string[];
};

const DEFAULT_HANDLES = ["vertical", "both", "horizontal"];

const OptionsPanel = <T extends HTMLElement = HTMLElement>({
  children,
  elementId,
  elementRef,
  isSelected,
  zIndex,
  isResizingMode = false,
  toggleResizingMode,
  allowedHandles = DEFAULT_HANDLES,
}: OptionsPanelProps<T>) => {
  const { zIndexLimits, zIndexChange, deleteElement } = useContext(
    ElementOperationsContext
  );
  void elementRef;

  const renderHandle = (h: string) => {
    // maintain backward-compatible "both" class for bottom-right semantics
    const className =
      h === "bottom-right"
        ? "resize-handle both bottom-right"
        : `resize-handle ${h}`;
    return <div key={h} className={className} data-handle={h} />;
  };

  return (
    <div
      className="options-panel-cont"
      data-selected={isSelected}
      data-resizing={isResizingMode}
      style={{}}
    >
      <div className="options-panel">
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
        <button
          onClick={(e) => {
            // prevent clicks on this control from bubbling and re-selecting or dragging
            e.stopPropagation();
            toggleResizingMode?.();
          }}
        >
          {isResizingMode ? "Stop Resize" : "Resize"}
        </button>
      </div>
      {children}
      {allowedHandles.map((h) => renderHandle(h))}
    </div>
  );
};

export default OptionsPanel;
