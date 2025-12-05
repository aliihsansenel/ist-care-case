const DraggableItem = ({ type }: { type: string }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("elementData", JSON.stringify({ type }));
    document.body.classList.add("is-dragging");
  };

  const handleDragEnd = () => {
    document.body.classList.remove("is-dragging");
  };

  // const handleDrag = (e: React.DragEvent) => {
  //   console.log(e);
  // };

  return (
    <div
      className="draggable-item"
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      // onDrag={handleDrag}
      style={{
        backgroundColor: "#bbb",
      }}
    >
      {type}
    </div>
  );
};

export default DraggableItem;
