import React, { useContext } from "react";

import type { ElementData, ElementDataArray } from "./types";
import { ElementOperationsContext, GridContext } from "./contexts";

import ComponentSelector from "./ComponentSelector";

import "./style/preview.css";

const Preview = () => {
  const { enabled: gridEnabled } = useContext(GridContext);

  const [droppedComps, setDroppedComps] = React.useState<ElementDataArray>([]);

  const deleteElement = (elementId: string | null) => {
    setDroppedComps((comps) => comps.filter((comp) => comp.id !== elementId));
  };

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
      const newZIndex =
        droppedComps.length === 0 ? 0 : Number(droppedComps.at(-1)?.zIndex) + 1;
      setDroppedComps([
        ...droppedComps,
        {
          id: newId,
          type: elementData.type,
          left,
          top,
          zIndex: newZIndex,
        },
      ]);
    }
  };

  const zIndexChange = (elementId: ElementData["id"], increment: number) => {
    setDroppedComps((prev) => {
      // Not cloning prev state causing missing renders.
      const arr = [...prev];
      const idx = arr.findIndex((e) => e.id === elementId);
      if (idx === -1) return prev;

      const current = { ...arr[idx] };
      const curZ = current.zIndex;

      let candidateIndex = -1;

      if (increment === 1) {
        // find element with smallest zIndex > curZ
        let minGreater = Infinity;
        arr.forEach((e, i) => {
          if (e.zIndex > curZ && e.zIndex < minGreater) {
            minGreater = e.zIndex;
            candidateIndex = i;
          }
        });
      } else if (increment === -1) {
        // find element with largest zIndex < curZ
        let maxSmaller = -Infinity;
        arr.forEach((e, i) => {
          if (e.zIndex < curZ && e.zIndex > maxSmaller) {
            maxSmaller = e.zIndex;
            candidateIndex = i;
          }
        });
      } else {
        return prev;
      }

      if (candidateIndex === -1) return prev;

      const target = { ...arr[candidateIndex] };

      // swap zIndex
      const tmpZ = current.zIndex;
      current.zIndex = target.zIndex;
      target.zIndex = tmpZ;

      arr[idx] = current;
      arr[candidateIndex] = target;

      return arr;
    });
  };

  const zIndexLimits = (() => {
    if (droppedComps.length === 0) {
      return { bottom: 0, top: 0 };
    }

    let minZ = Infinity;
    let maxZ = -Infinity;

    for (const e of droppedComps) {
      const z = Number(e.zIndex);
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }

    return { bottom: minZ, top: maxZ };
  })();

  return (
    <ElementOperationsContext.Provider
      value={{ zIndexLimits, zIndexChange, deleteElement }}
    >
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        id="preview"
        style={{ border: "2px dashed #ccc", padding: 0 }}
      >
        {droppedComps.map((data) => ComponentSelector(data))}
      </div>
    </ElementOperationsContext.Provider>
  );
};

export default Preview;
