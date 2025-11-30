import React from "react";

import TextContent from "./TextContent";
import Header from "./Header";
import Footer from "./Footer";
import Card from "./Card";

import type { TypeWithCoordinates } from "./types";

const ComponentSelector = ({
  type,
  left,
  top,
}: TypeWithCoordinates): React.ReactElement => {
  switch (type) {
    case "header":
      return <Header />;
    case "footer":
      return <Footer />;
    case "text-content":
      return <TextContent />;
    case "card":
      return <Card left={left} top={top} />;
    default:
      return <Header />;
  }
};

export default ComponentSelector;
