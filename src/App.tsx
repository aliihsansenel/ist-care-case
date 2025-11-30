import { createContext, useState } from "react";

import PreviewArea from "./components/PreviewContainer";
import Sidebar from "./components/Sidebar";

import "./App.css";

export type GridType = {
  enabled: boolean;
  size: number;
  snap: boolean;
};

const initialGridValues: GridType = {
  enabled: false,
  size: 10,
  snap: false,
};

// TODO learn how to move to another file.
export const GridContext = createContext<GridType>(initialGridValues);

function App() {
  const [grid, setGrid] = useState<GridType>(initialGridValues);

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
