import { useContext } from "react";

import { DeleteElementContext } from "./Preview";

import "./style/preview.css";

const OptionsPanel = ({
  children,
  elementId,
  elementRef,
  isSelected,
}: {
  children: React.ReactNode;
  elementId: string | null;
  elementRef: HTMLElement;
  isSelected: boolean;
}) => {
  const { deleteElement } = useContext(DeleteElementContext);

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
