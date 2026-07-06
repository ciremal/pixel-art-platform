import './App.css'

const App = () => {
  return (
    <>
      <div className="header">
        <h1>Pixel Art Platform</h1>
      </div>
      <div
        className="container"
      >
        <div style={{ flex: '1 1 0', border: '1px solid #ccc' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto' }}>
            <div style={{ textAlign: 'center'}}>Pencil</div>
            <div style={{ textAlign: 'center'}}>Eraser</div>
            <div style={{ textAlign: 'center'}}>Paint Bucket</div>
            <div style={{ textAlign: 'center'}}>Line</div>
            <div style={{ textAlign: 'center'}}>Square</div>
            <div style={{ textAlign: 'center'}}>Circle</div>
            <div style={{ textAlign: 'center'}}>Color Picker</div>
          </div>
        </div>
        <div style={{ flex: '4 1 0', border: '1px solid #ccc' }}></div>
        <div style={{ flex: '1 1 0', border: '1px solid #ccc' }}></div>
      </div>
    </>
  )
}

export default App
