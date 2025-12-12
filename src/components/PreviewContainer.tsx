import GridOptions from "./GridOptions";
import Preview from "./Preview";

import { buildOutput } from "../utils/exportJson";
import type { BuilderReturnType } from "../utils/export_types";

function PreviewContainer() {
  function tempName() {
    const exportResult: BuilderReturnType = buildOutput();
    console.log(exportResult);
  }

  return (
    <main id="preview-cont">
      <div id="preview-settings">
        <button onClick={tempName}>Export JSON</button>
        <GridOptions />
      </div>
      <Preview />
    </main>
  );
}

export default PreviewContainer;
