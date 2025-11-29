import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface ComponentSelectorProps {
  type: string;
}

const ComponentSelector = ({ type }: ComponentSelectorProps): React.FC => {
  switch (type) {
    case "header":
      return Header;
    case "footer":
      return Footer;
    default:
      return Header;
  }
};

export default ComponentSelector;
