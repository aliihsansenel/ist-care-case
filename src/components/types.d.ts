import type { LucideIcon } from "lucide-react";

export type GridType = {
  grid: { enabled: boolean; size: number; snap: boolean };
  setGrid: Dispatch<SetStateAction<GridType>>;
};

export type DraggableType =
  | "header"
  | "footer"
  | "text-content"
  | "card"
  | "slider";

export interface DraggableItemInfo {
  icon: LucideIcon;
  title: string;
  description: string;
}

export type ElementData = {
  id: string | null;
  type: DraggableType;
  left: number | string;
  top: number | string;
  zIndex: number;
};

export type ElementDataArray = ElementData[];

export type ElementOperationsContextType = {
  zIndexLimits: { bottom: number; top: number };
  deleteElement: (elementId: string | null) => void;
  zIndexChange: (elementId: string | null, increment: number) => void;
};
