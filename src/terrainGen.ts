//@ts-ignore
import Perlin from 'perlin.js'
import { inverseLerp } from './util/math'
import { Vector2 } from 'three'

const regions: TerrainType[] = []
regions.push({ name: 'water', height: 0.45, colour: '#1133AA' })
regions.push({ name: 'waterShallow', height: 0.5, colour: '#2255BB' })
regions.push({ name: 'sand', height: 0.52, colour: '#CCDD22' })
regions.push({ name: 'grass', height: 0.68, colour: '#44BC11' })
regions.push({ name: 'grass2', height: 0.75, colour: '#44DC11' })
regions.push({ name: 'rock', height: 0.9, colour: '#559911' })
regions.push({ name: 'rock2', height: 0.98, colour: '#342111' })
regions.push({ name: 'mountain', height: 1, colour: '#EEEEEE' })

interface TerrainType {
  name: string
  height: number
  colour: string
}

export const generateTerrain = (width: number, height: number) => {
  // todo change for predictable seed..
  Perlin.seed(Math.random())

  let scale = 20

  if (scale <= 0) {
    scale = 1
  }

  const octaves = 4
  const offsetX = 0
  const offsetY = 0

  const octaveOffsets: Vector2[] = []
  for (let i = 0; i < octaves; i++) {
    // todo better randomness => seeded
    const oX = (Math.random() - 0.5) * 20000 + offsetX
    const oY = (Math.random() - 0.5) * 20000 + offsetY
    octaveOffsets[i] = new Vector2(oX, oY)
  }

  const persistance = 0.5
  const lacunarity = 2

  let maxNoiseHeight = Number.MIN_SAFE_INTEGER
  let minNoiseHeight = Number.MAX_SAFE_INTEGER

  const noiseMap: number[][] = new Array(width)
    .fill(0)
    .map(() => new Array(height).fill(0))

  const colorMap: string[][] = new Array(width)
    .fill(0)
    .map(() => new Array(height).fill(0))

  // Initial perlin noise
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // All Perlin functions return values in the range of -1 to 1.

      let amplitude = 1
      let frequency = 1
      let noiseHeight = 0

      for (let i = 0; i < octaves; i++) {
        const sampleX = (x / scale) * frequency + octaveOffsets[i].x
        const sampleY = (y / scale) * frequency + octaveOffsets[i].y

        const perlinValue = Perlin.perlin2(sampleX, sampleY) * 2 - 1
        noiseHeight += perlinValue * amplitude

        amplitude *= persistance
        frequency *= lacunarity
      }
      noiseMap[x][y] = noiseHeight

      if (noiseHeight > maxNoiseHeight) {
        maxNoiseHeight = noiseHeight
      } else if (noiseHeight < minNoiseHeight) {
        minNoiseHeight = noiseHeight
      }

      // ... or Perlin.simplex3 and Perlin.perlin3:
      // var value = Perlin.simplex3(x / 100, y / 100, time);
      // image[x][y].r = Math.abs(value) * 256; // Or whatever. Open demo.html to see it used with canvas.
    }
  }

  // Perlin inverse lerp smoothing
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      noiseMap[x][y] = inverseLerp(
        minNoiseHeight,
        maxNoiseHeight,
        noiseMap[x][y]
      )
    }
  }

  //Color map generation
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const currentHeight = noiseMap[x][y]
      for (let i = 0; i < regions.length; i++) {
        if (currentHeight <= regions[i].height) {
          colorMap[x][y] = regions[i].colour
          break
        }
      }
    }
  }

  return { noiseMap, colorMap }
}
