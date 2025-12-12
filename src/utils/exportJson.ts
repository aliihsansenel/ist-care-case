import type {
  BuilderReturnType,
  CanvasInfo,
  ExportMetadata,
  GridOptions,
  ProjectInfo,
} from "./export_types";

type PageElement = HTMLElement | null;
let previewElement: PageElement, gridOptionsElement: PageElement;

export function buildOutput(): BuilderReturnType {
  let returnObject: BuilderReturnType = {
    output: null,
    success: false,
    message: "No output!",
  };
  let output = null;
  previewElement = document.getElementById("preview")!;
  gridOptionsElement = document.getElementById("grid-options")!;

  const inputs = gridOptionsElement.querySelectorAll("input");

  const date = new Date().toISOString();
  const projectInfo: ProjectInfo = {
    name: "Test Builder Layout",
    version: "1.0",
    created: date,
    lastModified: date,
  };
  const gridOptions: GridOptions = {
    enabled: inputs[1].checked,
    size: Number(inputs[0].value),
    snap: inputs[2].checked,
  };
  const canvasInfo: CanvasInfo = {
    width: previewElement.clientWidth,
    height: previewElement.clientHeight,
    grid: gridOptions,
  };
  const metadata: ExportMetadata = {
    totalElements: previewElement.childNodes.length,
    exportFormat: "json",
    exportVersion: "2.0",
  };

  // let elements = previewElement.childNodes;

  output = { project: projectInfo, canvas: canvasInfo, elements: [], metadata };

  returnObject = { output, success: true, message: "Successfull." };
  return returnObject;
}

function exportJson() {
  if (previewElement) {
    for (const child of previewElement.children) {
      console.log(child);
    }
  }
}

export default exportJson;
