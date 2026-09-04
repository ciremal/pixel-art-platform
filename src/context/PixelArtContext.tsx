import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  DEFAULT_COLOR,
  DEFAULT_GRID_SIZE,
  DEFAULT_TOOL,
} from "../util/constants";
import type { Color, GridSize, ToolType } from "../util/types";
import { newCanvas } from "../util/utils";

type PixelArtContextValue = {
  gridSize: GridSize;
  setGridSize: Dispatch<SetStateAction<GridSize>>;
  pixels: Color[][];
  setPixels: Dispatch<SetStateAction<Color[][]>>;
  color: Color;
  setColor: Dispatch<SetStateAction<Color>>;
  tool: ToolType;
  setTool: Dispatch<SetStateAction<ToolType>>;
};

const PixelArtContext = createContext<PixelArtContextValue | undefined>(
  undefined,
);

export const PixelArtProvider = ({ children }: { children: ReactNode }) => {
  const [gridSize, setGridSize] = useState<GridSize>(DEFAULT_GRID_SIZE);
  const [pixels, setPixels] = useState<Color[][]>(newCanvas(DEFAULT_GRID_SIZE));
  const [color, setColor] = useState<Color>(DEFAULT_COLOR);
  const [tool, setTool] = useState<ToolType>(DEFAULT_TOOL);

  const value: PixelArtContextValue = {
    gridSize,
    setGridSize,
    pixels,
    setPixels,
    color,
    setColor,
    tool,
    setTool
  };

  return (
    <PixelArtContext.Provider value={value}>
      {children}
    </PixelArtContext.Provider>
  );
};

export const usePixelArt = () => {
  const context = useContext(PixelArtContext);

  if (!context) {
    throw new Error("usePixelArt must be used within a PixelArtProvider");
  }

  return context;
};
