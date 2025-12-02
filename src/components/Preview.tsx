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
    const elementData = JSON.parse(e.dataTransfer.getData("elementData"));
    const preview: HTMLElement = document.getElementById("preview")!;

    const pos = { x: e.clientX, y: e.clientY };
    const rect = preview.getBoundingClientRect();

    let left: number | string, top: number | string;

    if (elementData.elementId !== undefined && elementData.elementId !== null) {
      // TODO grid enabled scenario
      left = `${((pos.x - rect.left + elementData.offsetX) / rect.width) * 100.0}%`;
      top = pos.y - rect.top + elementData.offsetY;
      setDroppedComps((comps) =>
        comps.map((comp) =>
          comp.id === elementData.elementId ? { ...comp, left, top } : comp
        )
      );
    } else {
      if (!gridEnabled) {
        left = `${((pos.x - rect.left) / rect.width) * 100.0}%`;
        top = pos.y - rect.top;
      } else {
        left = 0;
        top = 0;
      }
      // TODO temporary id management for new item
      const newId =
        droppedComps.length === 0
          ? "0"
          : String(Number(droppedComps.at(-1)?.id) + 1);
      setDroppedComps([
        ...droppedComps,
        {
          id: newId,
          type: elementData.type,
          left,
          top,
        },
      ]);
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
