import React from "react";

import "./style/preview.css";

const Preview = () => {
  const [droppedComps, setDroppedComps] = React.useState<string[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    const type = e.dataTransfer.getData("type");

    setDroppedComps([...droppedComps, type]);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="preview"
      style={{ border: "2px dashed #ccc", padding: 0 }}
    >
      {droppedComps.map((type, index) => (
        <div
          key={index}
          style={{ padding: 10, border: "1px solid blue", margin: 5 }}
        >
          {type} Component
        </div>
      ))}
    </div>
  );
};

export default Preview;
