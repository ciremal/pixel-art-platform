export const GRID_SIZES = [12, 16, 24, 32, 64, 100, 128] as const
export type GridSize = typeof GRID_SIZES[number]

export type Color = {
    r: number,
    g: number,
    b: number,
    a: number
}

export type ToolType = 'pencil' | 'eraser' | 'paint-bucket' | 'line' | 'square' | 'circle' | 'color-picker'