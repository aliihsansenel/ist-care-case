import React from "react";

import TextContent from "./TextContent";
import Header from "./Header";
import Footer from "./Footer";
import Card from "./Card";

import type { ElementData } from "./types";

const ComponentSelector = ({
  id,
  type,
  left,
  top,
}: ElementData): React.ReactElement => {
  switch (type) {
    case "header":
      return <Header key={id} elementId={id} />;
    case "footer":
      return <Footer key={id} elementId={id} />;
    case "text-content":
      return <TextContent key={id} elementId={id} />;
    case "card":
      return <Card key={id} elementId={id} left={left} top={top} />;
    default:
      return <Header elementId={id} />;
  }
};

export default ComponentSelector;
