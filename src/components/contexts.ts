import { createContext } from "react";

import type { DeleteElementContextType, GridType } from "./types";

export const initialGridValues: GridType = {
  enabled: false,
  size: 10,
  snap: false,
};

export const DeleteElementContext = createContext<DeleteElementContextType>({
  deleteElement: () => {},
});

export const GridContext = createContext<GridType>(initialGridValues);
