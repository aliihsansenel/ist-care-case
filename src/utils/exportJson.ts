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
  } else {
    returnObject.message = validation.message;
  }

  return returnObject;
}

function validateElements(): ValidatorReturnType {
  const previewElement: PageElement = document.getElementById("preview")!;
  const previewRect = previewElement.getBoundingClientRect();
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

  let errorFlag: boolean = false;
  canvasElements.forEach((el, idx) => {
    const element = el as HTMLElement;
    const elIndex = element.getAttribute("data-element-id")!;
    const foundIndex = zIndexArray.findIndex(
      (sortedEl) => elIndex === sortedEl.id
    );
    if (foundIndex !== -1) {
      let exportElement: ExportedElement | null = null;
      const exportElId = String(idx + 1).padStart(3, "0");

      const elementRect = element.getBoundingClientRect();
      const inside =
        previewRect.left <= elementRect.left &&
        previewRect.top <= elementRect.top &&
        previewRect.bottom >= elementRect.bottom &&
        previewRect.right >= elementRect.right;
      if (!errorFlag && !inside) {
        errorFlag = true;
        returnObject.message = "One of the element placed out of the canvas!";
      }
      let exportHeight;
      switch (element.className) {
        case "header":
          exportHeight = Number(element.style.height.split("px")[0]);
          exportElement = {
            id: exportElId,
            type: "header",
            content: {
              text: element.textContent,
              style: "default",
            },
            position: {
              x: 0,
              y: 0,
              width: "100%",
              height: exportHeight,
              zIndex: foundIndex + 1,
            },
            responsive: {
              mobile: {
                width: "100%",
                height: Math.max(40, exportHeight - 20),
              },
              tablet: {
                width: "100%",
                height: Math.max(50, exportHeight - 10),
              },
            },
          };
          break;
        case "footer":
          exportHeight = Number(element.style.height.split("px")[0]);
          exportElement = {
            id: exportElId,
            type: "footer",
            content: {
              copyright: "placeholder",
              links: [],
            },
            position: {
              x: 0,
              y: `calc(100% - ${exportHeight}px)`,
              width: "100%",
              height: exportHeight,
              zIndex: foundIndex + 1,
              fixed: true,
            },
          };
          break;
        case "text-content":
          exportElement = {
            id: exportElId,
            type: "text-content",
            content: {
              html: element.querySelector("[contenteditable]")?.innerHTML || "",
              plainText:
                element.querySelector("[contenteditable]")?.textContent || "",
            },
            position: {
              x: Number(element.style.left.split("px")[0]),
              y: Number(element.style.top.split("px")[0]),
              width: Number(element.style.width?.split("px")[0]) || "auto",
              height: "auto",
              zIndex: foundIndex + 1,
              minHeight: 100,
            },
          };
          break;
        case "card":
          exportElement = {
            id: exportElId,
            type: "card",
            content: {
              title: element.querySelector(".title")?.textContent || "",
              description: element.querySelector(".desc")?.textContent || "",
              image: null,
            },
            position: {
              x: Math.round(
                (Number(element.style.left.split("%")[0]) / 100.0) *
                  previewRect.width
              ),
              y: Number(element.style.top.split("px")[0]),
              width: Number(element.style.width.split("px")[0]),
              height: Number(element.style.height.split("px")[0]),
              zIndex: foundIndex + 1,
            },
          };
          break;
        case "slider":
          exportHeight = Number(element.style.height.split("px")[0]);
          exportElement = {
            id: exportElId,
            type: "slider",
            content: {
              image_urls: ["placeholder", "placeholder"],
            },
            position: {
              x: 0,
              y: 0,
              width: "100%",
              height: exportHeight,
              zIndex: foundIndex + 1,
            },
          };
          break;
        default:
          if (!errorFlag && !inside) {
            errorFlag = true;
            returnObject.message = "Unsupported element type";
          }
          break;
      }
      if (exportElement) {
        elements.push(exportElement);
      }
    }
  });

  if (errorFlag) {
    returnObject.elements = [];
    returnObject.success = false;
  } else {
    returnObject.elements = elements;
    returnObject.success = true;
    returnObject.message = "Validation satistied.";
  }
  return returnObject;
}
