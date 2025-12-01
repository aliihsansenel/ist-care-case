import { useEffect, useState, useCallback } from "react";
import ContentEditable, {
  type ContentEditableEvent,
} from "react-contenteditable";

import "./style/preview.css";
import { selectionEvents } from "../utils/selectionPubSub";

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

  return (
    <ContentEditable
      className="card"
      data-element-id={elementId}
      onClick={() => selectionEvents.publish(elementId)}
      style={{
        width: "300px",
        height: "200px",
        left,
        top,
        // TODO Temporary indicator of focused element
        backgroundColor: isSelected ? "blue" : "initial",
      }}
      onChange={onContentChange}
      html={content}
    />
  );
};

export default Card;
