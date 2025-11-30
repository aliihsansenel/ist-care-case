const DraggableItem = ({ type }: { type: string }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("type", type);
  };

  // const handleDrag = (e: React.DragEvent) => {
  //   console.log(e);
  // };

  return (
    <div
      draggable={true}
      onDragStart={handleDragStart}
      // onDrag={handleDrag}
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
