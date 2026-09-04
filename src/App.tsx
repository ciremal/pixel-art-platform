import { useCallback, useEffect, useRef } from "react";
import "./App.css";
import ToolBar from "./components/toolBar/toolBar";
import UtilBar from "./components/utilBar/utilBar";
import { usePixelArt } from "./context/PixelArtContext";
import { DEFAULT_COLOR } from "./util/constants";
import {
  bfsFill,
  colorToString,
  getNeutralCellColor,
  getSides,
  getSquare,
  isPainted,
  updateCell,
} from "./util/utils";
import type { Cell, Color } from "./util/types";

const App = () => {
  const { gridSize, pixels, setPixels, color, setColor, tool } = usePixelArt();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPixelRef = useRef<{ X: number; Y: number } | null>(null);

  const previewShapeStartPixel = useRef<Cell>(null);
  const previewShapeCurrPixel = useRef<Cell>(null);

  const isLastPixel = (X: number, Y: number) =>
    lastPixelRef.current?.X === X && lastPixelRef.current?.Y === Y;

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const pixelSize = size / gridSize;

    ctx.clearRect(0, 0, size, size);

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const pixel = pixels[y][x];
        ctx.fillStyle = isPainted(pixel)
          ? colorToString(pixel)
          : (x + y) % 2 === 0
            ? "#ffffff"
            : "#d9d9d9";
        drawRect(x, y, pixelSize, ctx);
      }
    }

    ctx.beginPath();
    ctx.strokeStyle = "#767676";

    for (let i = 0; i <= gridSize; i++) {
      const pos = i * pixelSize;

      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, size);

      ctx.moveTo(0, pos);
      ctx.lineTo(size, pos);
    }

    ctx.stroke();
  }, [gridSize, pixels]);

  const drawPreview = (start: Cell, curr: Cell, color: Color) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pixelSize = size / gridSize;
    const { left, right, top, bottom } = getSides(
      start.X,
      curr.X,
      start.Y,
      curr.Y,
    );
    const boundedLeft = Math.max(0, left);
    const boundedRight = Math.min(gridSize - 1, right);
    const boundedTop = Math.max(0, top);
    const boundedBottom = Math.min(gridSize - 1, bottom);

    if (boundedLeft > boundedRight || boundedTop > boundedBottom) return;

    ctx.fillStyle = colorToString(color);
    for (let X = boundedLeft; X <= boundedRight; X++) {
      drawRect(X, boundedTop, pixelSize, ctx);
      drawRect(X, boundedBottom, pixelSize, ctx);
    }

    for (let Y = boundedTop; Y <= boundedBottom; Y++) {
      drawRect(boundedLeft, Y, pixelSize, ctx);
      drawRect(boundedRight, Y, pixelSize, ctx);
    }
  };

  const drawRect = (
    x: number,
    y: number,
    size: number,
    ctx: CanvasRenderingContext2D,
  ) => {
    ctx.fillRect(x * size, y * size, size, size);
  };

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(() => {
      drawCanvas();
    });
    resizeObserver.observe(canvas);

    const handleMouseDown = (event: MouseEvent) => {
      isDrawingRef.current = true;

      const rect = canvas.getBoundingClientRect();
      const { X, Y } = getSquare(
        rect.top,
        rect.bottom,
        rect.left,
        rect.right,
        gridSize,
        event.clientX,
        event.clientY,
      );

      switch (tool) {
        case "pencil":
          updateCell(Y, X, color, setPixels);
          break;
        case "color-picker":
          setColor(isPainted(pixels[Y][X]) ? pixels[Y][X] : DEFAULT_COLOR);
          break;
        case "paint-bucket":
          const newPixels = bfsFill(X, Y, gridSize, pixels, color);
          setPixels(newPixels);
          break;
        case "eraser":
          if (isPainted(pixels[Y][X])) {
            updateCell(Y, X, getNeutralCellColor(X, Y), setPixels);
          }
          break;
        case "square":
          previewShapeStartPixel.current = { X, Y };
          previewShapeCurrPixel.current = { X, Y };
          drawPreview({ X, Y }, { X, Y }, color);
          break;
        default:
          break;
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDrawingRef.current) return;

      const rect = canvas.getBoundingClientRect();
      const { X, Y } = getSquare(
        rect.top,
        rect.bottom,
        rect.left,
        rect.right,
        gridSize,
        event.clientX,
        event.clientY,
      );

      if (!isLastPixel(X, Y)) {
        switch (tool) {
          case "pencil":
            updateCell(Y, X, color, setPixels);
            break;
          case "eraser":
            if (isPainted(pixels[Y][X])) {
              updateCell(Y, X, getNeutralCellColor(X, Y), setPixels);
            }
            break;
          case "square":
            if (previewShapeStartPixel.current) {
              drawCanvas();
              drawPreview(previewShapeStartPixel.current, { X, Y }, color);
              previewShapeCurrPixel.current = { X, Y };
            }
            break;
          default:
            break;
        }
        lastPixelRef.current = { X, Y };
      }
    };

    const handleMouseUp = () => {
      isDrawingRef.current = false;
      lastPixelRef.current = null;
      if (previewShapeStartPixel.current && previewShapeCurrPixel.current) {
        const newPixels = [...pixels];

        const { X: X1, Y: Y1 } = previewShapeStartPixel.current;
        const { X: X2, Y: Y2 } = previewShapeCurrPixel.current;

        const { left, right, top, bottom } = getSides(X1, X2, Y1, Y2);

        for (let X = left; X <= right; X++) {
          newPixels[Y1][X] = color;
          newPixels[Y2][X] = color;
        }

        for (let Y = top; Y <= bottom; Y++) {
          newPixels[Y][X1] = color;
          newPixels[Y][X2] = color;
        }

        drawCanvas();
        setPixels(newPixels);

        previewShapeStartPixel.current = null
        previewShapeCurrPixel.current = null
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      resizeObserver.disconnect();
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [color, drawCanvas, gridSize, setPixels, tool, drawPreview]);

  return (
    <>
      <div className="header">
        <h1>Pixel Art Platform</h1>
      </div>

      <div className="container">
        <div className="sidebar">
          <ToolBar />
        </div>

        <div className="canvasArea">
          <div className="canvasContainer">
            <canvas ref={canvasRef} />
          </div>
        </div>

        <div className="sidebar">
          <UtilBar />
        </div>
      </div>
    </>
  );
};

export default App;
