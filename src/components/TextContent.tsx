import React, { useState } from "react";
import ContentEditable, {
  type ContentEditableEvent,
} from "react-contenteditable";

const TextContent = ({
  elementId,
  left,
  top,
  zIndex,
}: {
  elementId: string | null;
  left?: number | string;
  top?: number | string;
  zIndex?: number;
}) => {
  const [content, setContent] = useState("");

  const onContentChange = React.useCallback((evt: ContentEditableEvent) => {
    setContent(evt.currentTarget.innerHTML);
  }, []);

  return (
    <ContentEditable
      data-element-id={elementId}
      style={{
        border: "2px solid black",
        position: "absolute",
        width: "100%",
        height: "auto",
        left: left ?? undefined,
        top: top ?? undefined,
        zIndex,
      }}
      onChange={onContentChange}
      onBlur={onContentChange}
      html={content}
    />
  );
};

export default TextContent;
