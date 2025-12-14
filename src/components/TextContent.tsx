import React, { useEffect, useRef, useState } from "react";
import ContentEditable, {
  type ContentEditableEvent,
} from "react-contenteditable";

import { selectionEvents } from "../utils/selectionPubSub";
import { useResizable } from "../hooks/useResizable";

import OptionsPanel from "./OptionsPanel";

const TextContent = ({
  elementId,
  left,
  top,
  zIndex,
}: {
  elementId: string | null;
  left?: number | string;
  top?: number | string;
  zIndex: number;
}) => {
  const [content, setContent] = useState("");
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [size, setSize] = useState({ width: 0, height: 100 });
  const [isResizingMode, setIsResizingMode] = useState<boolean>(false);

  const elementRef = useRef<HTMLDivElement | null>(null);
  useResizable(elementRef, (s) => setSize(s), isResizingMode);

  useEffect(() => {
    const handler = (newId: string | null) => {
      setIsSelected(newId === elementId);
    };
    const unsub = selectionEvents.subscribe(handler);
    return () => {
      unsub();
    };
  }, [elementId]);

  const onContentChange = React.useCallback((evt: ContentEditableEvent) => {
    setContent(evt.currentTarget.innerHTML);
  }, []);

  return (
    <div
      className="text-content"
      ref={elementRef}
      data-element-id={elementId}
      onClick={() => selectionEvents.publish(elementId)}
      style={{
        left: left ?? undefined,
        top: top ?? undefined,
        height: size.height + "px",
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
        allowedHandles={[
          "top-left",
          "top",
          "top-right",
          "right",
          "bottom-right",
          "bottom",
          "bottom-left",
          "left",
        ]}
      >
        <ContentEditable
          onChange={onContentChange}
          onBlur={onContentChange}
          html={content}
        />
      </OptionsPanel>
    </div>
  );
};

export default TextContent;
