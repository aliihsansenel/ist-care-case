type DragSource = "sidebar" | "existing" | "resize";

type BeginExistingOptions = {
  element: HTMLElement;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

/**
 * OverlapDetector keeps local, persistent state outside React to perform
 * collision detection during drag and resize without re-querying the DOM
 * each frame. The preview component or drag sources call its methods to
 * initialize and update detection.
 *
 * Usage lifecycle:
 * - beginDragFromSidebar(previewEl, type) on sidebar dragstart
 * - beginDragExisting(previewEl, { element, pivot... }) on element dragstart
 * - onDragOver(clientX, clientY) on each preview onDragOver frame
 * - hasBlockingOverlap() to decide whether to allow drop
 * - end() on dragend/drop to cleanup
 *
 * Resizing lifecycle:
 * - beginResize(previewEl, element) when resize starts
 * - onResizeMoveRect(rect) on each pointermove with element's live rect
 * - end() when resize ends
 */
class OverlapDetector {
  private previewEl: HTMLElement | null = null;
  private items: HTMLElement[] = [];
  private excludeEl: HTMLElement | null = null;

  private source: DragSource | null = null;
  private draggedType: string | null = null;

  private offsetX = 0;
  private offsetY = 0;
  private dragW = 0;
  private dragH = 0;

  private hasOverlapFlag = false;

  private computeDefaultSize(type: string): { width: number; height: number } {
    const previewRect = this.previewEl?.getBoundingClientRect();
    const pw = previewRect?.width ?? 0;

    switch (type) {
      case "header":
        return { width: pw, height: 80 };
      case "footer":
        return { width: pw, height: 60 };
      case "card":
        return { width: 300, height: 200 };
      case "slider":
        return { width: pw, height: 400 };
      case "text-content":
        // Text has auto size; for overlap detection use a small band height,
        // and full width to avoid allowing overlap where text would render.
        return { width: pw, height: 40 };
      default:
        return { width: 100, height: 100 };
    }
  }

  private refreshItems(preview: HTMLElement, exclude: HTMLElement | null) {
    const children = Array.from(preview.children) as HTMLElement[];
    // Cache items once; exclude the element currently being dragged if any,
    // and also ignore any .hidden[draggable="true"] (self being dragged).
    this.items = children.filter(
      (el) =>
        !(exclude && el === exclude) && !el.matches('.hidden[draggable="true"]')
    );
  }

  beginDragFromSidebar(preview: HTMLElement, type: string) {
    this.previewEl = preview;
    this.source = "sidebar";
    this.draggedType = type;
    this.excludeEl = null;
    this.offsetX = 0;
    this.offsetY = 0;

    const size = this.computeDefaultSize(type);
    this.dragW = size.width;
    this.dragH = size.height;

    this.refreshItems(preview, null);
    this.clearHighlights();
  }

  beginDragExisting(preview: HTMLElement, opts: BeginExistingOptions) {
    this.previewEl = preview;
    this.source = "existing";
    this.draggedType = null;
    this.excludeEl = opts.element;
    this.offsetX = opts.offsetX;
    this.offsetY = opts.offsetY;
    this.dragW = opts.width;
    this.dragH = opts.height;

    this.refreshItems(preview, opts.element);
    this.clearHighlights();
  }

  beginResize(preview: HTMLElement, element: HTMLElement) {
    this.previewEl = preview;
    this.source = "resize";
    this.draggedType = null;
    this.excludeEl = element;
    this.offsetX = 0;
    this.offsetY = 0;
    this.dragW = 0;
    this.dragH = 0;

    this.refreshItems(preview, element);
    this.clearHighlights();
  }

  // Called on each dragover frame within the preview
  onDragOver(clientX: number, clientY: number): boolean {
    if (!this.previewEl) return false;

    // Sidebar items may depend on preview width; keep width up-to-date.
    if (this.source === "sidebar" && this.draggedType) {
      const size = this.computeDefaultSize(this.draggedType);
      this.dragW = size.width;
      this.dragH = size.height;
    }

    const testRect = {
      left: clientX + this.offsetX,
      top: clientY + this.offsetY,
      right: 0,
      bottom: 0,
    };
    testRect.right = testRect.left + this.dragW;
    testRect.bottom = testRect.top + this.dragH;

    return this.applyCollisions(testRect);
  }

  // Called during resizing with the element's live rect
  onResizeMoveRect(
    rect: DOMRect | { left: number; top: number; right: number; bottom: number }
  ): boolean {
    if (!this.previewEl) return false;
    const testRect = {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
    };
    return this.applyCollisions(testRect);
  }

  hasBlockingOverlap(): boolean {
    return this.hasOverlapFlag;
  }

  clearHighlights() {
    for (const el of this.items) {
      el.classList.remove("dragging-over");
    }
    this.hasOverlapFlag = false;
  }

  end() {
    this.clearHighlights();
    this.previewEl = null;
    this.items = [];
    this.excludeEl = null;

    this.source = null;
    this.draggedType = null;

    this.offsetX = 0;
    this.offsetY = 0;
    this.dragW = 0;
    this.dragH = 0;
  }

  private applyCollisions(testRect: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  }): boolean {
    const overlapping = new Set<HTMLElement>();

    for (const el of this.items) {
      const r = el.getBoundingClientRect();
      const intersects = !(
        testRect.right <= r.left ||
        testRect.left >= r.right ||
        testRect.bottom <= r.top ||
        testRect.top >= r.bottom
      );
      if (intersects) {
        overlapping.add(el);
      }
    }

    // Update CSS classes
    for (const el of this.items) {
      if (overlapping.has(el)) {
        el.classList.add("dragging-over");
      } else {
        el.classList.remove("dragging-over");
      }
    }

    this.hasOverlapFlag = overlapping.size > 0;
    return this.hasOverlapFlag;
  }
}

export const overlapDetector = new OverlapDetector();
