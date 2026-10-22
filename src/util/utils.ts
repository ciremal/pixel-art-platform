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
  let queueIndex = 0;

  queue.push({ X: selectedX, Y: selectedY });

  while (queueIndex < queue.length) {
    const cell = queue[queueIndex++];

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

export const getLinePoints = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) => {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = Math.sign(x2 - x1);
  const sy = Math.sign(y2 - y1);
  let err = dx - dy;

  const values = [];

  while (true) {
    values.push({ x: x1, y: y1 });

    if (x1 === x2 && y1 === y2) break;

    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
  }

  return values;
};

export const getCircle = (x1: number, y1: number, x2: number, y2: number) => {
  let x0 = x1;
  let y0 = y1;
  let x1_temp = x2;
  let y1_temp = y2;

  // Calculate dimensions
  let a = Math.abs(x1_temp - x0);
  let b = Math.abs(y1_temp - y0);
  let b1 = b & 1;

  // Error increments
  let dx = 4 * (1 - a) * b * b;
  let dy = 4 * (b1 + 1) * a * a;
  let err = dx + dy + b1 * a * a;
  let e2;

  // Normalize coordinates so x0, y0 is top-left and x1_temp, y1_temp is bottom-right
  if (x0 > x1_temp) {
    x0 = x1_temp;
    x1_temp += a;
  }
  if (y0 > y1_temp) {
    y0 = y1_temp;
  }

  y0 += Math.floor((b + 1) / 2);
  let y1_curr = y0 - b1;

  a *= 8 * a;
  b1 = 8 * b * b;

  const pixelMap = new Map();
  function addPixel(px: number, py: number) {
    pixelMap.set(`${px},${py}`, { x: px, y: py });
  }

  do {
    addPixel(x1_temp, y0);
    addPixel(x0, y0);
    addPixel(x0, y1_curr);
    addPixel(x1_temp, y1_curr);

    e2 = 2 * err;
    if (e2 <= dy) {
      y0++;
      y1_curr--;
      err += dy += a;
    } // Y-step
    if (e2 >= dx || 2 * err > dy) {
      x0++;
      x1_temp--;
      err += dx += b1;
    } // X-step
  } while (x0 <= x1_temp);

  // Clean up remaining flat tips if needed
  while (y0 - y1_curr < b) {
    addPixel(x0 - 1, y0);
    addPixel(x1_temp + 1, y0++);
    addPixel(x0 - 1, y1_curr);
    addPixel(x1_temp + 1, y1_curr--);
  }

  return Array.from(pixelMap.values());
}
