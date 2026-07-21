import { GRID_SIZES, type GridSize } from "../../util/types"
import type { Dispatch, FC, SetStateAction } from "react"
import { newCanvas } from "../../util/utils"

type UtilBarProps = {
    setGridSize: (size: GridSize) => void
    setPixels: Dispatch<SetStateAction<string[][]>>
}

const UtilBar: FC<UtilBarProps> = ({ setGridSize, setPixels }) => {
    const handleCanvasGridChange = (size: GridSize) => {
        setGridSize(size)
        setPixels(newCanvas(size))
    }

    return (
        <>
            {GRID_SIZES.map((size: GridSize) => (
                <button key={size} onClick={() => handleCanvasGridChange(size)}>{size}</button>
            ))}
        </>
    )
}

export default UtilBar