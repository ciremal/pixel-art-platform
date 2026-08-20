import type { Dispatch, SetStateAction } from "react";
import type { Color, GridSize } from "./types";

export const updateCell = (
  rowIndex: number,
  colIndex: number,
  newValue: Color,
  setState: Dispatch<SetStateAction<string[][]>>,
) => {
  const { r, g, b, a } = newValue;
  const color = `rgba(${r},${g},${b},${a})`;
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
    new Array(gridSize).fill("#ffffff"),
  );
};
