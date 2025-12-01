const Footer = ({ elementId }: { elementId: string | null }) => {
  return (
    <footer
      className="footer"
      data-element-id={elementId}
      style={{
        border: "2px solid black",
        position: "absolute",
        width: "100%",
        height: "60px",
        bottom: 0,
      }}
    >
      Footer
    </footer>
  );
};

export default Footer;
