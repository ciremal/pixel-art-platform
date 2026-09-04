import type { Dispatch, SetStateAction } from "react";
import type { Cell, Color, GridSize } from "./types";

export const isPainted = (color: Color): boolean => color.a > 0;

export const isSameColor = (left: Color, right: Color): boolean => {
  return (
    left.r === right.r &&
    left.g === right.g &&
    left.b === right.b &&
    left.a === right.a
  );
};

export const getNeutralCellColor = (x: number, y: number): Color => {
  const isLight = (x + y) % 2 === 0;
  return {
    r: isLight ? 255 : 217,
    g: isLight ? 255 : 217,
    b: isLight ? 255 : 217,
    a: 0,
  };
};

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
): Cell => {
  const size = Math.min(right - left, bottom - top);
  const pixelSize = size / gridSize;
  const X = Math.floor((clickX - left) / pixelSize);
  const Y = Math.floor((clickY - top) / pixelSize);

  return { X, Y };
};

export const newCanvas = (gridSize: GridSize) => {
  return Array.from({ length: gridSize }, (_, y) =>
    Array.from({ length: gridSize }, (_, x) => getNeutralCellColor(x, y)),
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
  if (isSameColor(colorToFill, color)) {
    return pixels;
  }

  const newPixels = pixels.map((row) => [...row]);
  const visited = new Set<string>();
  const queue: Array<Cell> = [];

  queue.push({ X: selectedX, Y: selectedY });

  while (queue.length > 0) {
    const cell = queue.shift();
    if (!cell) continue;

    const { X, Y } = cell;
    if (X < 0 || X >= gridSize || Y < 0 || Y >= gridSize) continue;
    if (visited.has(`${X},${Y}`)) continue;

    const currColor = newPixels[Y][X];
    if (
      isSameColor(currColor, colorToFill) ||
      (!isPainted(currColor) && !isPainted(colorToFill))
    ) {
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

export const getSides = (x1: number, x2: number, y1: number, y2: number) => {
  const left = Math.min(x1, x2);
  const right = Math.max(x1, x2);
  const top = Math.min(y1, y2);
  const bottom = Math.max(y1, y2);
  return { left, right, top, bottom };
};
