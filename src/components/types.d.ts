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
};

export type DeleteElementContextType = {
  deleteElement: (elementId: string | null) => void;
};

// export type ElementRefTypes =

export type ElementDataArray = ElementData[];
