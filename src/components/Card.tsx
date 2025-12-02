import { useEffect, useState, useCallback, useRef, useContext } from "react";
import ContentEditable, {
  type ContentEditableEvent,
} from "react-contenteditable";

import "./style/preview.css";
import { selectionEvents } from "../utils/selectionPubSub";
import { DeleteElementContext } from "./Preview";

const Card = ({
  elementId,
  left,
  top,
}: {
  elementId: string | null;
  left: number | string;
  top: number | string;
}) => {
  const [content, setContent] = useState("");
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const { deleteElement } = useContext(DeleteElementContext);

  const elementRef = useRef<HTMLDivElement>(null);

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
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={() => elementRef.current?.classList.remove("hidden")}
      style={{
        width: "300px",
        height: "200px",
        left,
        top,
        // TODO Temporary indicator of focused element
        backgroundColor: isSelected ? "blue" : "initial",
      }}
    >
      <ContentEditable onChange={onContentChange} html={content} />
    </div>
  );
};

export default Card;
