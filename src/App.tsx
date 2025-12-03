import { useState } from "react";

import { GridContext, initialGridValues } from "./components/contexts";
import type { GridType } from "./components/types";

import PreviewArea from "./components/PreviewContainer";
import Sidebar from "./components/Sidebar";

import "./App.css";

function App() {
  const [grid, setGrid] = useState<GridType>(initialGridValues);

  void setGrid;

  return (
    <div className={"app"}>
      <GridContext.Provider value={grid}>
        <PreviewArea />
        <Sidebar />
      </GridContext.Provider>
    </div>
  );
}

export default App;
