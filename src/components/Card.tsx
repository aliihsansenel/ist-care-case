import { useEffect, useState, useCallback, useRef } from "react";
import ContentEditable, {
  type ContentEditableEvent,
} from "react-contenteditable";

import { selectionEvents } from "../utils/selectionPubSub";
import { overlapDetector } from "../utils/overlapDetector";

import OptionsPanel from "./OptionsPanel";

import "./style/preview.css";
import { useResizable } from "../hooks/useResizable";

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
  const [size, setSize] = useState({ width: 300, height: 200 });

  // local flag to enable resizing mode (when true, the card should not be draggable)
  const [isResizingMode, setIsResizingMode] = useState<boolean>(false);

  const elementRef = useRef<HTMLDivElement | null>(null);
  // pass isResizingMode to the hook so it only starts resizing when mode is enabled.
  useResizable(elementRef, (s) => setSize(s), isResizingMode);

  const handleDragEnter = () => {
    if (!elementRef.current?.classList.contains("hidden"))
      elementRef.current?.classList.add("dragging-over");
  };
  const handleDragLeave = (e: React.DragEvent) => {
    if (e.target === elementRef.current)
      elementRef.current?.classList.remove("dragging-over");
  };

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
      elementRef.current.classList.add("hidden");
      const pos = { x: e.clientX, y: e.clientY };
      const selfRect = elementRef.current.getBoundingClientRect();
      const offsetX = -pos.x + selfRect.left;
      const offsetY = -pos.y + selfRect.top;

      e.dataTransfer.setData(
        "elementData",
        JSON.stringify({
          elementId,
          type: "card",
          offsetX,
          offsetY,
        })
      );

      const preview = document.getElementById("preview") as HTMLElement | null;
      if (preview) {
        overlapDetector.beginDragExisting(preview, {
          element: elementRef.current,
          offsetX,
          offsetY,
          width: elementRef.current.offsetWidth,
          height: elementRef.current.offsetHeight,
        });
      }
    }
  };

  return (
    <div
      className="card"
      ref={elementRef}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      data-element-id={elementId}
      onClick={() => selectionEvents.publish(elementId)}
      draggable={isSelected && !isResizingMode}
      onDragStart={handleDragStart}
      onDragEnd={() => {
        elementRef.current?.classList.remove("hidden");
        overlapDetector.end();
      }}
      style={{
        width: size.width + "px",
        height: size.height + "px",
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
        isResizingMode={isResizingMode}
        toggleResizingMode={() => setIsResizingMode((v) => !v)}
      >
        <ContentEditable onChange={onContentChange} html={content} />
      </OptionsPanel>
    </div>
  );
};

export default Card;
