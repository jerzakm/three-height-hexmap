import { System } from 'ecsy'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import {
  Mesh,
  MeshPhongMaterial,
  Vector2,
  Frustum,
  Matrix4,
  Vector3,
  BufferGeometry,
  MeshBasicMaterial,
  BufferAttribute,
  VertexColors,
} from 'three'

import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { generateTerrain } from '../terrainGen'
import { Position2 } from '../components/basic/Position2'
import { Color } from '../components/basic/Color'
import { mainScene, camera } from '../three'
import { calcHexLocation } from '../hexGrid/hexMath'
import { TranslateComponent } from '../components/TranslateComponent'
import { worldSettings } from '../main'
import { HexTile } from '../components/TagComponents'
import { assets } from '../assets'

const r = 1
const h = 1 * Math.sqrt(3)

export class TerrainSystem extends System {
  hexModel!: Mesh
  hexGeometry!: BufferGeometry
  noiseMap!: number[][]
  colorMap!: string[][]
  colorMaterials!: any
  // This method will get called on every frame by default
  init() {
    const objLoader = new OBJLoader()
    this.colorMaterials = {}
    objLoader.load('hexagon.obj', (group: any) => {
      this.hexGeometry = assets.hexGeometry

      //Temporary generation here TODO move outside of terrain system
      const { noiseMap, colorMap } = generateTerrain(
        worldSettings.width,
        worldSettings.height
      )
      this.colorMap = colorMap
      this.noiseMap = noiseMap

      const geometries: BufferGeometry[] = []

      const hexHelper = new Mesh(
        this.hexGeometry,
        new MeshBasicMaterial({ color: 'yellow', wireframe: true })
      )

      const groupSize = 16

      for (
        let groupX = 0;
        groupX < Math.ceil(noiseMap.length / groupSize);
        groupX++
      ) {
        for (
          let groupY = 0;
          groupY < Math.ceil(noiseMap.length / groupSize);
          groupY++
        ) {}
      }

      for (let x = 0; x < noiseMap.length; x++) {
        for (let y = 0; y < noiseMap[0].length; y++) {
          const hexEntity = this.world.createEntity(`${x}:${y}`)
          hexEntity.addComponent(Position2, { value: new Vector2(x, y) })
          hexEntity.addComponent(Color, { value: colorMap[x][y] })
          hexEntity.addComponent(HexTile)

          const waterLevel = 0.5
          const terrainHeight =
            this.noiseMap[x][y] < waterLevel
              ? waterLevel - 0.2
              : this.noiseMap[x][y]

          const hex3dY = terrainHeight ** 4 * 5

          const hexCoords = calcHexLocation(x, y, r, h, false)
          hexHelper.position.set(hexCoords.x, hex3dY - 5, hexCoords.y)

          if (terrainHeight > waterLevel) {
            const geometry = this.hexGeometry.clone()

            const c = Math.random() * 255
            const rgb = [c, c, c]

            // make an array to store colors for each vertex
            const numVerts = geometry.getAttribute('position').count
            const itemSize = 3 // r, g, b
            const colors = new Uint8Array(itemSize * numVerts)

            // copy the color into the colors array for each vertex
            colors.forEach((v, ndx) => {
              colors[ndx] = rgb[ndx % 3]
            })

            const normalized = true
            const colorAttrib = new BufferAttribute(
              colors,
              itemSize,
              normalized
            )
            geometry.setAttribute('color', colorAttrib)

            hexHelper.updateWorldMatrix(true, false)
            geometry.applyMatrix4(hexHelper.matrixWorld)

            geometries.push(geometry)
          }
        }
      }

      console.log(geometries)

      const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
        geometries,
        false
      )
      const material = new MeshPhongMaterial({
        //@ts-ignore
        vertexColors: VertexColors,
      })
      const mesh = new Mesh(mergedGeometry, material)
      mesh.castShadow = true
      mesh.receiveShadow = true
      mainScene.add(mesh)
    })
  }

  execute(delta: any, time: any) {
    // Tile gets added for the first time
    // camera.updateMatrix()
    // camera.updateMatrixWorld()
    for (let i = 0; i < this.queries.hexTiles.results.length; i++) {
      const hexEntity = this.queries.hexTiles.results[i]
    }
  }
}

TerrainSystem.queries = {
  hexTiles: {
    components: [HexTile],
    listen: {
      added: false,
      removed: false,
      changed: true,
    },
  },
}
