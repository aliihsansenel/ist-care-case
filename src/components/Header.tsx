const Header = ({ elementId }: { elementId: string | null }) => {
  return (
    <header
      className="header"
      data-element-id={elementId}
      style={{
        border: "2px solid black",
        position: "sticky",
        width: "100%",
        height: "80px",
        top: 0,
      }}
    >
      Header
    </header>
  );
};

export default Header;
