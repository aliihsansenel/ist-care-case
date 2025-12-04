import { useEffect, useState, useCallback, useRef } from "react";
import ContentEditable, {
  type ContentEditableEvent,
} from "react-contenteditable";

import { selectionEvents } from "../utils/selectionPubSub";

import OptionsPanel from "./OptionsPanel";

import "./style/preview.css";

const Card = ({
  elementId,
  left,
  top,
  zIndex,
}: {
  elementId: string | null;
  left: number | string;
  top: number | string;
  zIndex: number;
}) => {
  const [content, setContent] = useState("");
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const elementRef = useRef<HTMLDivElement | null>(null);

  const onContentChange = useCallback((evt: ContentEditableEvent) => {
    setContent(evt.currentTarget.innerHTML);
  }, []);

  // Subscribe to selection and update 'isSelected' based on value published
  useEffect(() => {
    const handler = (newId: string | null) => {
      setIsSelected(newId === elementId);
    };
    const unsub = selectionEvents.subscribe(handler);
    return () => {
      unsub();
    };
  }, [elementId]);

  const handleDragStart = (e: React.DragEvent) => {
    if (elementRef.current) {
      elementRef.current?.classList.add("hidden");
      const preview: HTMLElement = document.getElementById("preview")!;
      const pos = { x: e.clientX, y: e.clientY };
      const previewRect = preview.getBoundingClientRect();
      const selfRect = elementRef.current.getBoundingClientRect()!;

      e.dataTransfer.setData(
        "elementData",
        JSON.stringify({
          elementId,
          type: "card",
          offsetX: previewRect.left - pos.x + selfRect.left,
          offsetY: previewRect.top - pos.y + selfRect.top,
        })
      );
    }
  };

  return (
    <div
      className="card"
      ref={elementRef}
      data-element-id={elementId}
      onClick={() => selectionEvents.publish(elementId)}
      draggable={isSelected}
      onDragStart={handleDragStart}
      onDragEnd={() => elementRef.current?.classList.remove("hidden")}
      style={{
        width: "300px",
        height: "200px",
        left,
        top,
        zIndex,
      }}
    >
      <OptionsPanel
        elementId={elementId}
        elementRef={elementRef}
        isSelected={isSelected}
        zIndex={zIndex}
      >
        <ContentEditable onChange={onContentChange} html={content} />
      </OptionsPanel>
    </div>
  );
};

export default Card;
