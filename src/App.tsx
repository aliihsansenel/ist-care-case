import { useState } from "react";

import { GridContext, initialGridValues } from "./components/contexts";

import PreviewArea from "./components/PreviewContainer";
import Sidebar from "./components/Sidebar";

import "./App.css";

function App() {
  const [grid, setGrid] = useState(initialGridValues.grid);

  return (
    <div className="app">
      <GridContext.Provider value={{ grid, setGrid }}>
        <PreviewArea />
        <Sidebar />
      </GridContext.Provider>
    </div>
  );
}

export default App;
