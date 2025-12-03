import { useContext } from "react";
import type { RefObject } from "react";

import { DeleteElementContext } from "./Preview";

import "./style/preview.css";

type OptionsPanelProps<T extends HTMLElement = HTMLElement> = {
  children: React.ReactNode;
  elementId: string | null;
  elementRef: RefObject<T | null>;
  isSelected: boolean;
};

const OptionsPanel = <T extends HTMLElement = HTMLElement>({
  children,
  elementId,
  elementRef,
  isSelected,
}: OptionsPanelProps<T>) => {
  const { deleteElement } = useContext(DeleteElementContext);
  void elementRef;

  return (
    <div className="options-panel-cont" style={{}}>
      <div
        className="options-panel"
        style={{ visibility: isSelected ? "visible" : "hidden" }}
      >
        <button onClick={() => deleteElement(elementId)}>Delete</button>
      </div>
      {children}
    </div>
  );
};

export default OptionsPanel;
