import type { Dispatch, SetStateAction } from "react";
import type { Color, GridSize } from "./types";

export const updateCell = (
  rowIndex: number,
  colIndex: number,
  color: Color,
  setState: Dispatch<SetStateAction<Color[][]>>,
) => {
  setState((prevState) =>
    prevState.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((cell, cIdx) => (cIdx === colIndex ? color : cell))
        : row,
    ),
  );
};

export const getSquare = (
  top: number,
  bottom: number,
  left: number,
  right: number,
  gridSize: GridSize,
  clickX: number,
  clickY: number,
) => {
  const size = Math.min(right - left, bottom - top);
  const pixelSize = size / gridSize;
  const X = Math.floor((clickX - left) / pixelSize);
  const Y = Math.floor((clickY - top) / pixelSize);

  return { X, Y };
};

export const newCanvas = (gridSize: GridSize) => {
  return Array.from({ length: gridSize }, () =>
    new Array(gridSize).fill({ r: 255, g: 255, b: 255, a: 1 }),
  );
};

export const colorToString = (color: Color): string => {
  const { r, g, b, a } = color;
  return `rgba(${r},${g},${b},${a ?? 1})`;
};
