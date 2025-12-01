import React, { useState } from "react";
import ContentEditable, {
  type ContentEditableEvent,
} from "react-contenteditable";

const TextContent = ({ elementId }: { elementId: string | null }) => {
  const [content, setContent] = useState("");

  const onContentChange = React.useCallback((evt: ContentEditableEvent) => {
    setContent(evt.currentTarget.innerHTML);
  }, []);

  return (
    <ContentEditable
      data-element-id={elementId}
      style={{
        border: "2px solid black",
        width: "100%",
        height: "auto",
      }}
      onChange={onContentChange}
      onBlur={onContentChange}
      html={content}
    />
  );
};

export default TextContent;
