const DraggableItem = ({ type }: { type: string }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("type", type);
  };

  return (
    <div
      draggable={true}
      onDragStart={handleDragStart}
      style={{
        cursor: "grab",
        backgroundColor: "#bbb",
      }}
    >
      {type}
    </div>
  );
};

export default DraggableItem;
