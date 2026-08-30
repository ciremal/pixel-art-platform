import { type Color, type GridSize } from "../../util/types";
import { type Dispatch, type FC, type SetStateAction } from "react";
import { newCanvas } from "../../util/utils";
import { RgbaColorPicker } from "react-colorful";
import "./utilBar.css";
import Dropdown from "../Dropdown";
import Stack from "../Stack";

type UtilBarProps = {
  gridSize: GridSize;
  setGridSize: (size: GridSize) => void;
  setPixels: Dispatch<SetStateAction<string[][]>>;
  color: Color;
  setColor: Dispatch<SetStateAction<Color>>;
};

const UtilBar: FC<UtilBarProps> = ({
  gridSize,
  setGridSize,
  setPixels,
  color,
  setColor,
}) => {
  const options = [
    { label: "12 x 12", value: "12" },
    { label: "16 x 16", value: "16" },
    { label: "24 x 24", value: "24" },
    { label: "32 x 32", value: "32" },
    { label: "64 x 64", value: "64" },
    { label: "100 x 100", value: "100" },
    { label: "128 x 128", value: "128" },
  ];

  const value = gridSize.toString();

  const handleChange = (value: string) => {
    const nextSize = parseInt(value, 10) as GridSize;
    setGridSize(nextSize);
    setPixels(newCanvas(nextSize));
  };

  return (
    <div className="utilBar">
      <Stack gap={2}>
        <div>
          <h2>Grid Size</h2>
          <Dropdown
            options={options}
            value={value}
            onChange={handleChange}
            placeholder="Select grid size"
          />
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
      </Stack>
    </div>
  );
};

export default UtilBar;
