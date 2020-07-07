//@ts-ignore
import Perlin from 'perlin.js'

export const generateTerrain = (width: number, height: number) => {
  const canvas = document.createElement('canvas')

  canvas.width = width
  canvas.height = height

  canvas.style.position = 'fixed'
  canvas.style.zIndex = '10'

  document.body.appendChild(canvas)

  noise(canvas)

  return canvas
}

function noise(canvas: HTMLCanvasElement) {
  Perlin.seed(Math.random())

  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = 'rgb(0,0,0)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  for (var x = 0; x < canvas.width; x++) {
    for (var y = 0; y < canvas.height; y++) {
      // All Perlin functions return values in the range of -1 to 1.

      // Perlin.simplex2 and Perlin.perlin2 for 2d noise
      const value = Perlin.perlin2(x / 20, y / 20)
      const c = (value + 1) * 120
      if (ctx) {
        ctx.fillStyle = `rgba(${c},${c},${c},1)`
        ctx.fillRect(x, y, 1, 1)
      }
      // ... or Perlin.simplex3 and Perlin.perlin3:
      // var value = Perlin.simplex3(x / 100, y / 100, time);
      // image[x][y].r = Math.abs(value) * 256; // Or whatever. Open demo.html to see it used with canvas.
    }
  }
}
