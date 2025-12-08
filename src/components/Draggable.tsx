import { useRef } from "react";

import {
  Image,
  LayoutList,
  PanelBottom,
  PanelTop,
  TypeOutline,
} from "lucide-react";

import type { DraggableItemInfo, DraggableType } from "./types";
import { overlapDetector } from "../utils/overlapDetector";

const DraggableItems: Record<DraggableType, DraggableItemInfo> = {
  header: {
    icon: PanelTop,
    title: "Header",
    description: "Page header with navigation",
  },
  footer: {
    icon: PanelBottom,
    title: "Footer",
    description: "Page footer with links",
  },
  "text-content": {
    icon: TypeOutline,
    title: "Text",
    description: "Simple text block",
  },
  card: {
    icon: LayoutList,
    title: "Content",
    description: "Content cards with text & images",
  },
  slider: {
    icon: Image,
    title: "Slider",
    description: "Image slider carousel",
  },
};

const DraggableItem = ({ type }: { type: DraggableType }) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const item = DraggableItems[type];

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("elementData", JSON.stringify({ type }));
    document.body.classList.add("is-dragging");
    elementRef.current?.classList.add("is-dragging");

    const preview = document.getElementById("preview") as HTMLElement | null;
    if (preview) {
      overlapDetector.beginDragFromSidebar(preview, type);
    }
  };

  const handleDragEnd = () => {
    document.body.classList.remove("is-dragging");
    elementRef.current?.classList.remove("is-dragging");
    overlapDetector.end();
  };

  // const handleDrag = (e: React.DragEvent) => {
  //   console.log(e);
  // };

  return (
    <div
      ref={elementRef}
      className="draggable-item"
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      // onDrag={handleDrag}
    >
      <div>
        <item.icon />
      </div>
      <div className="title">{item.title}</div>
      <div className="desc">{item.description}</div>
    </div>
  );
};

export default DraggableItem;
