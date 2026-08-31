import "./toolBar.css";
import { usePixelArt } from "../../context/PixelArtContext";

const ToolBar = () => {
  const { tool, setTool } = usePixelArt();

  return (
    <div className="toolGrid">
      <button
        onClick={() => setTool("pencil")}
        aria-pressed={tool === "pencil"}
        style={{ fontWeight: tool === "pencil" ? "bold" : "normal" }}
      >
        Pencil
      </button>
      <button
        onClick={() => setTool("eraser")}
        aria-pressed={tool === "eraser"}
        style={{ fontWeight: tool === "eraser" ? "bold" : "normal" }}
      >
        Eraser
      </button>
      <button
        onClick={() => setTool("paint-bucket")}
        aria-pressed={tool === "paint-bucket"}
        style={{ fontWeight: tool === "paint-bucket" ? "bold" : "normal" }}
      >
        Paint Bucket
      </button>
      <button
        onClick={() => setTool("line")}
        aria-pressed={tool === "line"}
        style={{ fontWeight: tool === "line" ? "bold" : "normal" }}
      >
        Line
      </button>
      <button
        onClick={() => setTool("square")}
        aria-pressed={tool === "square"}
        style={{ fontWeight: tool === 'square' ? 'bold' : 'normal'}}
      >
        Square
      </button>
      <button
        onClick={() => setTool("circle")}
        aria-pressed={tool === "circle"}
        style={{ fontWeight: tool === 'circle' ? 'bold' : 'normal'}}
      >
        Circle
      </button>
      <button
        onClick={() => setTool("color-picker")}
        aria-pressed={tool === "color-picker"}
        style={{ fontWeight: tool === 'color-picker' ? 'bold' : 'normal'}}
      >
        Color Picker
      </button>
    </div>
  );
};

export default ToolBar;
