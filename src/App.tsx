import { useEffect, useRef } from "react";
import "./App.css";
import ToolBar from "./components/toolBar/toolBar";
import UtilBar from "./components/utilBar/utilBar";
import { usePixelArt } from "./context/PixelArtContext";
import { DEFAULT_COLOR } from "./util/constants";
import {
  drawCanvas,
  drawPreviewLine,
  drawPreviewSquare,
} from "./util/canvasUtils";
import {
  bfsFill,
  getNeutralCellColor,
  getSides,
  getSquare,
  isPainted,
  getLinePoints,
  updateCell,
} from "./util/utils";
import type { Cell } from "./util/types";

const App = () => {
  const { gridSize, pixels, setPixels, color, setColor, tool } = usePixelArt();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPixelRef = useRef<{ X: number; Y: number } | null>(null);

  const previewShapeStartPixel = useRef<Cell>(null);
  const previewShapeCurrPixel = useRef<Cell>(null);

  const isLastPixel = (X: number, Y: number) =>
    lastPixelRef.current?.X === X && lastPixelRef.current?.Y === Y;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) drawCanvas(canvas, gridSize, pixels);
  }, [gridSize, pixels]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(() => {
      drawCanvas(canvas, gridSize, pixels);
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
          drawPreviewSquare(canvas, gridSize, { X, Y }, { X, Y }, color);
          break;
        case "line":
          previewShapeStartPixel.current = { X, Y };
          previewShapeCurrPixel.current = { X, Y };
          drawPreviewLine(canvas, gridSize, { X, Y }, { X, Y }, color);
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
              drawCanvas(canvas, gridSize, pixels);
              drawPreviewSquare(
                canvas,
                gridSize,
                previewShapeStartPixel.current,
                { X, Y },
                color,
              );
              previewShapeCurrPixel.current = { X, Y };
            }
            break;
          case "line":
            if (previewShapeStartPixel.current) {
              drawCanvas(canvas, gridSize, pixels);
              drawPreviewLine(
                canvas,
                gridSize,
                previewShapeStartPixel.current,
                { X, Y },
                color,
              );
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
        const newPixels = pixels.map((row) => [...row]);

        const { X: X1, Y: Y1 } = previewShapeStartPixel.current;
        const { X: X2, Y: Y2 } = previewShapeCurrPixel.current;

        if (tool === "square") {
          const { left, right, top, bottom } = getSides(X1, X2, Y1, Y2);

          for (let X = left; X <= right; X++) {
            newPixels[Y1][X] = color;
            newPixels[Y2][X] = color;
          }

          for (let Y = top; Y <= bottom; Y++) {
            newPixels[Y][X1] = color;
            newPixels[Y][X2] = color;
          }
        } else if (tool === "line") {
          const linePoints = getLinePoints(X1, Y1, X2, Y2);
          linePoints.forEach((point) => {
            newPixels[point.y][point.x] = color
          });
        }

        drawCanvas(canvas, gridSize, pixels);
        setPixels(newPixels);

        previewShapeStartPixel.current = null;
        previewShapeCurrPixel.current = null;
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
  }, [
    color,
    gridSize,
    pixels,
    setColor,
    setPixels,
    tool,
  ]);

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
