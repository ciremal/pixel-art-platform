import { GRID_SIZES, type Color, type GridSize } from "../../util/types";
import { type Dispatch, type FC, type SetStateAction } from "react";
import { newCanvas } from "../../util/utils";
import { RgbaColorPicker } from "react-colorful";
import './utilBar.css'

type UtilBarProps = {
  setGridSize: (size: GridSize) => void;
  setPixels: Dispatch<SetStateAction<string[][]>>;
  color: Color;
  setColor: Dispatch<SetStateAction<Color>>
};

const UtilBar: FC<UtilBarProps> = ({ setGridSize, setPixels, color, setColor }) => {
  const handleCanvasGridChange = (size: GridSize) => {
    setGridSize(size);
    setPixels(newCanvas(size));
  };

  return (
    <div className="utilBar">
      <div>
        {GRID_SIZES.map((size: GridSize) => (
          <button key={size} onClick={() => handleCanvasGridChange(size)}>
            {size}
          </button>
        ))}
      </div>
      <div>
        <RgbaColorPicker color={color} onChange={setColor} />
        <div className="color-inputs">
          <div className="color-input">
            <span>R</span>
            <input
              value={color.r}
              type="number"
              onChange={(e) => {
                const value = e.target.value;
                setColor({
                  ...color,
                  r: parseInt(value),
                });
              }}
            />
          </div>
          <div className="color-input">
            <span>G</span>
            <input
              value={color.g}
              type="number"
              onChange={(e) => {
                const value = e.target.value;
                setColor({
                  ...color,
                  g: parseInt(value),
                });
              }}
            />
          </div>
          <div className="color-input">
            <span>B</span>
            <input
              value={color.b}
              type="number"
              onChange={(e) => {
                const value = e.target.value;
                setColor({
                  ...color,
                  b: parseInt(value),
                });
              }}
            />
          </div>
          <div className="color-input">
            <span>A</span>
            <input
              value={color.a}
              type="number"
              onChange={(e) => {
                const value = e.target.value;
                setColor({
                  ...color,
                  a: parseFloat(value),
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilBar;
