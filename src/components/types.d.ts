export type GridType = {
  enabled: boolean;
  size: number;
  snap: boolean;
};

export type ElementData = {
  id: string | null;
  type: string;
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
