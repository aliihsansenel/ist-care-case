import { createContext } from "react";

import type { ElementOperationsContextType, GridType } from "./types";

export const initialGridValues: GridType = {
  enabled: false,
  size: 10,
  snap: false,
};

export const ElementOperationsContext =
  createContext<ElementOperationsContextType>({
    zIndexLimits: { bottom: 0, top: 0 },
    zIndexChange: () => {},
    deleteElement: () => {},
  });

export const GridContext = createContext<GridType>(initialGridValues);
