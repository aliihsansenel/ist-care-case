import type {
  BuilderReturnType,
  CanvasInfo,
  ExportedElement,
  ExportMetadata,
  GridOptions,
  ProjectInfo,
  ValidatorReturnType,
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

  const validation: ValidatorReturnType = validateElements();

  if (validation.success) {
    output = {
      project: projectInfo,
      canvas: canvasInfo,
      elements: validation.elements,
      metadata,
    };
    returnObject = { output, success: true, message: "Successfull." };
  }

  return returnObject;
}

function validateElements(): ValidatorReturnType {
  const previewElement: PageElement = document.getElementById("preview")!;
  const elements: ExportedElement[] = [];
  const returnObject: ValidatorReturnType = {
    elements: [],
    success: false,
    message: "Invalid element data!",
  };
  const canvasElements = Array.from(previewElement.children);

  const zIndexArray = canvasElements
    .map((el) => {
      const element = el as HTMLElement;
      return {
        id: element.getAttribute("data-element-id"),
        zIndex: Number(element.style.zIndex) || 0,
      };
    })
    .sort((a, b) => a.zIndex - b.zIndex);

  canvasElements.forEach((el, idx) => {
    const element = el as HTMLElement;
    const elIndex = element.getAttribute("data-element-id")!;
    const foundIndex = zIndexArray.findIndex(
      (sortedEl) => elIndex === sortedEl.id
    );
    if (foundIndex !== -1) {
      let exportElement: ExportedElement | null = null;
      const exportElId = String(idx).padStart(3, "0");
      switch (element.className) {
        case "header":
          exportElement = {
            id: exportElId,
            type: "header",
            content: {
              text: "placeholder text", // TODO placeholder
              style: "placeholder text", // TODO placeholder
            },
            position: {
              x: "placeholder",
              y: "placeholder",
              width: "placeholder",
              height: "placeholder",
              zIndex: foundIndex + 1,
            },
            // responsive?: ResponsiveMap;
          };
          break;
        case "footer":
          exportElement = {
            id: exportElId,
            type: "footer",
            content: {
              copyright: "placeholder", // TODO placeholder
              links: [], // TODO
            },
            position: {
              x: "placeholder",
              y: "placeholder",
              width: "placeholder",
              height: "placeholder",
              zIndex: foundIndex + 1,
            },
          };
          break;
        case "text-content":
          exportElement = {
            id: exportElId,
            type: "text-content",
            content: {
              html: "placeholder",
              plainText: "placeholder",
            },
            position: {
              x: "placeholder",
              y: "placeholder",
              width: "placeholder",
              height: "placeholder",
              zIndex: foundIndex + 1,
              minHeight: undefined,
            },
          };
          break;
        case "card":
          exportElement = {
            id: exportElId,
            type: "card",
            content: {
              title: "placeholder",
              description: "placeholder",
              image: null,
            },
            position: {
              x: "placeholder",
              y: "placeholder",
              width: "placeholder",
              height: "placeholder",
              zIndex: foundIndex + 1,
            },
          };
          break;
        case "slider":
          exportElement = {
            id: exportElId,
            type: "slider",
            content: {
              image_urls: ["placeholder", "placeholder"],
            },
            position: {
              x: "placeholder",
              y: "placeholder",
              width: "placeholder",
              height: "placeholder",
              zIndex: foundIndex + 1,
            },
          };
          break;
        default:
          break;
      }
      if (exportElement) {
        elements.push(exportElement);
      }
    }
  });
  returnObject.elements = elements;
  returnObject.success = true;
  returnObject.message = "Validation satistied.";

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
