const Slider = ({
  elementId,
  left,
  top,
  zIndex = 0,
}: {
  elementId: string | null;
  left?: number | string;
  top?: number | string;
  zIndex?: number;
}) => {
  return (
    <div
      className="slider"
      data-element-id={elementId}
      style={{
        border: "2px solid black",
        position: "absolute",
        width: "100%",
        height: "400px",
        left: left ?? undefined,
        top: top ?? undefined,
        zIndex,
      }}
    >
      Slider
    </div>
  );
};

export default Slider;
