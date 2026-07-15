import { useEffect, useRef, useState } from 'react'
import './App.css'
import { GRID_SIZES, type GridSize } from './util/types'

const App = () => {
  const [gridSize, setGridSize] = useState<GridSize>(24)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const pixels = Array.from({ length: gridSize },
    () => new Array(gridSize).fill('#ffffff')
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      const size = Math.min(rect.width, rect.height)
      const dpr = window.devicePixelRatio || 1

      canvas.width = size * dpr
      canvas.height = size * dpr

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const pixelSize = size / gridSize

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
      ctx.strokeStyle = '#767676'

      for (let i = 0; i <= gridSize; i++) {
        const pos = i * pixelSize

        // Draw vertical line
        ctx.moveTo(pos, 0)
        ctx.lineTo(pos, size)

        // Draw horizontal line
        ctx.moveTo(0, pos)
        ctx.lineTo(size, pos)
      }

      ctx.stroke()
    }

    draw()

    const observer = new ResizeObserver(draw)
    observer.observe(canvas)

    canvas.addEventListener('mousedown', (event) => {
      console.log('X: ', event.clientX, '- Y: ', event.clientY)
    })

    return () => observer.disconnect()
  }, [gridSize])

  return (
    <>
      <div className="header">
        <h1>Pixel Art Platform</h1>
      </div>

      <div className="container">
        <div className="sidebar">
          <div className="toolGrid">
            <div>Pencil</div>
            <div>Eraser</div>
            <div>Paint Bucket</div>
            <div>Line</div>
            <div>Square</div>
            <div>Circle</div>
            <div>Color Picker</div>
          </div>
        </div>

        <div className="canvasArea">
          <div className="canvasContainer">
            <canvas ref={canvasRef} />
          </div>
        </div>

        <div className="sidebar">
          {GRID_SIZES.map((size: GridSize) => (
            <button onClick={() => setGridSize(size)}>{size}</button>
          ))}

        </div>
      </div>
    </>
  )
}

export default App