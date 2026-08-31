import "./toolBar.css";
import { usePixelArt } from "../../context/PixelArtContext";

const ToolBar = () => {
  const { tool, setTool } = usePixelArt();

  return (
    <div className="toolGrid">
      <button
        onClick={() => setTool("pencil")}
        aria-pressed={tool === "pencil"}
      >
        Pencil
      </button>
      <button
        onClick={() => setTool("eraser")}
        aria-pressed={tool === "eraser"}
      >
        Eraser
      </button>
      <button
        onClick={() => setTool("paint-bucket")}
        aria-pressed={tool === "paint-bucket"}
      >
        Paint Bucket
      </button>
      <button onClick={() => setTool("line")} aria-pressed={tool === "line"}>
        Line
      </button>
      <button
        onClick={() => setTool("square")}
        aria-pressed={tool === "square"}
      >
        Square
      </button>
      <button
        onClick={() => setTool("circle")}
        aria-pressed={tool === "circle"}
      >
        Circle
      </button>
      <button
        onClick={() => setTool("color-picker")}
        aria-pressed={tool === "color-picker"}
      >
        Color Picker
      </button>
    </div>
  );
};

export default ToolBar;
