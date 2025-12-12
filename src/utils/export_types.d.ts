export interface ProjectInfo {
  name: string;
  version: string;
  created: string;
  lastModified: string;
}

export interface GridOptions {
  enabled: boolean;
  size: number;
  snap: boolean;
}

export interface CanvasInfo {
  width: number;
  height: number;
  grid: GridOptions;
}

export interface ResponsivePosition {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  minHeight?: number;
}

export interface ResponsiveMap {
  [breakpoint: "mobile" | "tablet"]: ResponsivePosition;
}

export interface ElementPosition {
  x: number | string;
  y: number | string;
  width: number | string;
  height?: number | string;
  zIndex: number;
  minHeight?: number;
  fixed?: boolean;
}

export interface HeaderContent {
  text: string;
  style?: string;
}

export interface FooterContent {
  copyright: string;
  links: string[];
}

export interface TextBlockContent {
  html: string;
  plainText: string;
}

export interface CardContent {
  title: string;
  description: string;
  image: string | null;
}

export interface SliderContent {
  image_urls: string[];
}

export type ElementType =
  | "header"
  | "footer"
  | "text-content"
  | "card"
  | "slider";

export type ElementContent =
  | HeaderContent
  | FooterContent
  | TextBlockContent
  | CardContent
  | SliderContent;

export interface BaseElement<T = ElementContent> {
  id: string;
  type: ElementType;
  content: T;
  position: ElementPosition;
  responsive?: ResponsiveMap;
}

export interface HeaderElement extends BaseElement<HeaderContent> {
  type: "header";
}
export interface FooterElement extends BaseElement<FooterContent> {
  type: "footer";
}
export interface TextContentElement extends BaseElement<TextBlockContent> {
  type: "text-content";
}
export interface CardElement extends BaseElement<CardContent> {
  type: "card";
}
export interface SliderElement extends BaseElement<SliderContent> {
  type: "slider";
}

export type ExportedElement =
  | HeaderElement
  | FooterElement
  | TextContentElement
  | CardElement
  | SliderElement;

export interface ExportMetadata {
  totalElements: number;
  exportFormat: string;
  exportVersion: string;
}

export interface BuilderExportJson {
  project: ProjectInfo;
  canvas: CanvasInfo;
  elements: ExportedElement[];
  metadata: ExportMetadata;
}

export interface BuilderReturnType {
  output: BuilderExportJson | null;
  success: boolean;
  message: string | null;
}
