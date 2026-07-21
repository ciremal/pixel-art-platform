import type { Dispatch, SetStateAction } from 'react'
import type { GridSize } from './types'

export const updateCell = (
    rowIndex: number,
    colIndex: number,
    newValue: string,
    setState: Dispatch<SetStateAction<string[][]>>
) => {
    setState(prevState =>
        prevState.map((row, rIdx) =>
            rIdx === rowIndex
                ? row.map((cell, cIdx) => (cIdx === colIndex ? newValue : cell))
                : row
        )
    )
}

export const getSquare = (
    top: number,
    bottom: number,
    left: number,
    right: number,
    gridSize: GridSize,
    clickX: number,
    clickY: number
) => {
    const size = Math.min(right - left, bottom - top)
    const pixelSize = size / gridSize
    const X = Math.floor((clickX - left) / pixelSize)
    const Y = Math.floor((clickY - top) / pixelSize)

    return { X, Y }
}

export const newCanvas = (gridSize: GridSize) => {
    return Array.from({ length: gridSize },
        () => new Array(gridSize).fill('#ffffff')
    )
}