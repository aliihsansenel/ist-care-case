import React from "react";

import Header from "./Header";
import Footer from "./Footer";
import TextContent from "./TextContent";
import Card from "./Card";
import Slider from "./Slider";

import type { ElementData } from "./types";

const ComponentSelector = ({
  id,
  type,
  left,
  top,
  zIndex,
}: ElementData): React.ReactElement => {
  switch (type) {
    case "header":
      return (
        <Header key={id} elementId={id} zIndex={zIndex} left={left} top={top} />
      );
    case "footer":
      return (
        <Footer key={id} elementId={id} zIndex={zIndex} left={left} top={top} />
      );
    case "text-content":
      return (
        <TextContent
          key={id}
          elementId={id}
          left={left}
          top={top}
          zIndex={zIndex}
        />
      );
    case "card":
      return (
        <Card key={id} elementId={id} left={left} top={top} zIndex={zIndex} />
      );
    case "slider":
      return (
        <Slider key={id} elementId={id} left={left} top={top} zIndex={zIndex} />
      );
    default:
      return (
        <Card key={id} elementId={id} left={left} top={top} zIndex={zIndex} />
      );
  }
};

export default ComponentSelector;
