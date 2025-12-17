import { useState } from "react";

import type { BuilderReturnType } from "../utils/export_types";
import { buildOutput } from "../utils/exportJson";

import GridOptions from "./GridOptions";
import Preview from "./Preview";

function PreviewContainer() {
  const [exportState, setExportState] = useState({
    status: false,
    message: "",
  });
  function exportJson() {
    const exportResult: BuilderReturnType = buildOutput();
    if (exportResult.success === false) {
      setExportState({
        status: false,
        message: exportResult.message || "Json export error!",
      });
      return;
    }

    const fileName = "export";
    const json = JSON.stringify(exportResult.output, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);

    setExportState({ status: true, message: "Json exported successfully!" });
  }

  return (
    <main id="preview-cont">
      <div id="preview-settings">
        <div className="export-elements">
          <button onClick={exportJson}>Export JSON</button>
          <div
            style={{
              color: exportState.status ? "green" : "red",
              letterSpacing: "1px",
            }}
          >
            <strong>{exportState.message}</strong>
          </div>
        </div>
        <GridOptions />
      </div>
      <Preview />
    </main>
  );
}

export default PreviewContainer;
