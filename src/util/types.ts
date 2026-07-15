export const GRID_SIZES = [12, 16, 24, 32, 64, 100, 128] as const
export type GridSize = typeof GRID_SIZES[number]