import React, { useState } from "react";
import ContentEditable, {
  type ContentEditableEvent,
} from "react-contenteditable";

import "./style/preview.css";

const Card = ({ left, top }: { left: number; top: number }) => {
  const [content, setContent] = useState("");

  const onContentChange = React.useCallback((evt: ContentEditableEvent) => {
    setContent(evt.currentTarget.innerHTML);
  }, []);

  return (
    <ContentEditable
      className="card"
      style={{
        width: "300px",
        height: "200px",
        left,
        top,
      }}
      onChange={onContentChange}
      onBlur={onContentChange}
      html={content}
    />
  );
};

export default Card;
