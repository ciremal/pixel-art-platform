import type { Dispatch, SetStateAction } from "react";
import type { Color, GridSize } from "./types";
import { usePixelArt } from "../context/PixelArtContext";

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

export const bfsFill = (
  selectedX: number,
  selectedY: number,
  gridSize: GridSize,
  pixels: Color[][],
  color: Color,
) => {
  const colorToFill = pixels[selectedY][selectedX];
  if (colorToString(colorToFill) === colorToString(color)) {
    return pixels;
  }

  const newPixels = [...pixels];
  const visited = new Set<string>();
  const queue: Array<{ X: number; Y: number }> = [];

  queue.push({ X: selectedX, Y: selectedY });

  while (queue.length > 0) {
    const cell = queue.shift();
    if (!cell) continue;

    const { X, Y } = cell;
    if (X < 0 || X >= gridSize || Y < 0 || Y >= gridSize) continue;
    if (visited.has(`${X},${Y}`)) continue;
    
    const currColor = newPixels[Y][X];
    if (colorToString(currColor) === colorToString(colorToFill)) {
      queue.push({ X: X + 1, Y });
      queue.push({ X: X - 1, Y });
      queue.push({ X, Y: Y + 1 });
      queue.push({ X, Y: Y - 1 });

      newPixels[Y][X] = color;
    }
    visited.add(`${X},${Y}`);
  }
  return newPixels;
};
