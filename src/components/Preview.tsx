import React, { useContext } from "react";

import { GridContext } from "../App";
import ComponentSelector from "./ComponentSelector";

import type { TypeWithCoordinatesArray } from "./types";

import "./style/preview.css";

const Preview = () => {
  const { enabled: gridEnabled } = useContext(GridContext);

  const [droppedComps, setDroppedComps] =
    React.useState<TypeWithCoordinatesArray>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    const type = e.dataTransfer.getData("type");

    const preview: HTMLElement = document.getElementById("preview")!;

    const pos = { x: e.clientX, y: e.clientY };
    const rect = preview.getBoundingClientRect();

    if (!gridEnabled) {
      setDroppedComps([
        ...droppedComps,
        { type, left: pos.x - rect.left, top: pos.y - rect.top },
      ]);
    } else {
      setDroppedComps([...droppedComps, { type, left: 0, top: 0 }]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      id="preview"
      style={{ border: "2px dashed #ccc", padding: 0 }}
    >
      {droppedComps.map((data) => ComponentSelector(data))}
    </div>
  );
};

export default Preview;
