import React from "react";

import Header from "./Header";
import Footer from "./Footer";
import TextContent from "./TextContent";

interface ComponentSelectorProps {
  type: string;
}

const ComponentSelector = ({ type }: ComponentSelectorProps): React.FC => {
  switch (type) {
    case "header":
      return Header;
    case "footer":
      return Footer;
    case "text-content":
      return TextContent;
    default:
      return TextContent;
  }
};

export default ComponentSelector;
