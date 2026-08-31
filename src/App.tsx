import { useCallback, useEffect, useRef } from "react";
import "./App.css";
import ToolBar from "./components/toolBar/toolBar";
import UtilBar from "./components/utilBar/utilBar";
import { usePixelArt } from "./context/PixelArtContext";
import { colorToString, getSquare, updateCell } from "./util/utils";

const App = () => {
  const { gridSize, pixels, setPixels, color, setColor, tool } = usePixelArt();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPixelRef = useRef<{ X: number; Y: number } | null>(null);

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
        ctx.fillStyle = colorToString(pixels[y][x]);
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
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
          if (lastPixelRef.current?.X !== X || lastPixelRef.current?.Y !== Y) {
            lastPixelRef.current = { X, Y };
            updateCell(Y, X, color, setPixels);
          }
          break;
        case "color-picker":
          setColor(pixels[Y][X]);
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

      switch (tool) {
        case "pencil":
          if (lastPixelRef.current?.X !== X || lastPixelRef.current?.Y !== Y) {
            lastPixelRef.current = { X, Y };
            updateCell(Y, X, color, setPixels);
          }
          break;
        default:
          break;
      }
    };

    const handleMouseUp = () => {
      isDrawingRef.current = false;
      lastPixelRef.current = null;
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
  }, [color, drawCanvas, gridSize, setPixels, tool]);

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
