import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import { type GridSize } from './util/types'
import ToolBar from './components/toolBar/toolBar'
import UtilBar from './components/utilBar/utilBar'
import { getSquare, newCanvas, updateCell } from './util/utils'
import { DEFAULT_GRID_SIZE } from './util/constants'

const App = () => {
  const [gridSize, setGridSize] = useState<GridSize>(DEFAULT_GRID_SIZE)
  const [pixels, setPixels] = useState(newCanvas(DEFAULT_GRID_SIZE))
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const size = Math.min(rect.width, rect.height)
    const dpr = window.devicePixelRatio || 1

    canvas.width = size * dpr
    canvas.height = size * dpr

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const pixelSize = size / gridSize

    ctx.clearRect(0, 0, size, size)

    // Draw pixels
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        ctx.fillStyle = pixels[y][x]
        ctx.fillRect(
          x * pixelSize,
          y * pixelSize,
          pixelSize,
          pixelSize
        )
      }
    }

    // Draw grid
    ctx.beginPath()
    ctx.strokeStyle = "#767676"

    for (let i = 0; i <= gridSize; i++) {
      const pos = i * pixelSize

      ctx.moveTo(pos, 0)
      ctx.lineTo(pos, size)

      ctx.moveTo(0, pos)
      ctx.lineTo(size, pos)
    }

    ctx.stroke()
  }, [pixels, gridSize])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeObserver = new ResizeObserver(() => {
      drawCanvas()
    })
    resizeObserver.observe(canvas)

    const handleMouseDown = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const { X, Y } = getSquare(
        rect.top,
        rect.bottom,
        rect.left,
        rect.right,
        gridSize,
        event.clientX,
        event.clientY
      )
      updateCell(Y, X, "#0062ff", setPixels)
    }
    canvas.addEventListener("mousedown", handleMouseDown)

    return () => {
      resizeObserver.disconnect()
      canvas.removeEventListener("mousedown", handleMouseDown)
    }
  }, [drawCanvas, gridSize])

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

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
          <UtilBar
            setGridSize={setGridSize}
            setPixels={setPixels}
          />
        </div>
      </div>
    </>
  )
}

export default App