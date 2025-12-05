const Slider = ({ elementId }: { elementId: string | null }) => {
  return (
    <div
      className="slider"
      data-element-id={elementId}
      style={{
        border: "2px solid black",
        position: "relative",
        width: "100%",
        height: "400px",
        top: 0,
      }}
    >
      Slider
    </div>
  );
};

export default Slider;
