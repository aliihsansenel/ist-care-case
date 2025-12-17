import { useContext } from "react";

import { GridContext } from "./contexts";

type InputChangeType = React.ChangeEvent<HTMLInputElement>;

function GridOptions() {
  const { grid, setGrid } = useContext(GridContext);

  const handleSizeChange = (e: InputChangeType) => {
    const value = Number(e.target.value);
    setGrid({
      ...grid,
      size: value,
    });
  };

  const handleEnabledChange = (e: InputChangeType) => {
    setGrid({
      ...grid,
      enabled: e.target.checked,
    });
  };

  const handleSnapChange = (e: InputChangeType) => {
    setGrid({
      ...grid,
      snap: e.target.checked,
    });
  };

  return (
    <div id="grid-options">
      <span>
        <b>Grid options</b>
      </span>
      <label>
        Size
        <input type="number" value={grid.size} onChange={handleSizeChange} />
      </label>
      <label>
        Enabled
        <input
          type="checkbox"
          checked={grid.enabled}
          onChange={handleEnabledChange}
        />
      </label>
      <label>
        Snap
        <input
          disabled={!grid.enabled}
          type="checkbox"
          checked={grid.snap}
          onChange={handleSnapChange}
        />
      </label>
    </div>
  );
}

export default GridOptions;
