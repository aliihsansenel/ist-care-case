import React, { useContext } from "react";

import { GridContext } from "../App";
import ComponentSelector from "./ComponentSelector";

import type { ElementDataArray } from "./types";

import "./style/preview.css";

const Preview = () => {
  const { enabled: gridEnabled } = useContext(GridContext);

  const [droppedComps, setDroppedComps] = React.useState<ElementDataArray>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    const type = e.dataTransfer.getData("type");

    // TODO temporary id management
    const newId =
      droppedComps.length === 0
        ? "0"
        : String(Number(droppedComps.at(-1)?.id) + 1);
    const preview: HTMLElement = document.getElementById("preview")!;

    const pos = { x: e.clientX, y: e.clientY };
    const rect = preview.getBoundingClientRect();

    if (!gridEnabled) {
      setDroppedComps([
        ...droppedComps,
        {
          id: newId,
          type,
          left: `${((pos.x - rect.left) / rect.width) * 100.0}%`,
          top: pos.y - rect.top,
        },
      ]);
    } else {
      setDroppedComps([...droppedComps, { id: newId, type, left: 0, top: 0 }]);
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
