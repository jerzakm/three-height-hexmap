import { System } from 'ecsy'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import {
  Mesh,
  MeshPhongMaterial,
  Vector2,
  Frustum,
  Matrix4,
  Vector3,
} from 'three'
import { generateTerrain } from '../terrainGen'
import { Position2 } from '../components/basic/Position2'
import { Color } from '../components/basic/Color'
import { HexTile } from '../components/basic/TagComponents'
import { Object3DComponent } from '../components/basic/MeshComponent'
import { mainScene, camera } from '../three'
import { calcHexLocation } from '../hexGrid/hexMath'
import { TranslateComponent } from '../components/TranslateComponent'
import { worldSettings } from '../main'

const r = 1
const h = 1 * Math.sqrt(3)

let counter = 0

export class TerrainSystem extends System {
  hexModel!: Mesh
  noiseMap!: number[][]
  colorMap!: string[][]
  colorMaterials!: any
  // This method will get called on every frame by default
  init() {
    const objLoader = new OBJLoader()
    this.colorMaterials = {}
    objLoader.load('hexagon.obj', (group: any) => {
      this.hexModel = group.children[0]
    })

    //Temporary generation here TODO move outside of terrain system
    const { noiseMap, colorMap } = generateTerrain(
      worldSettings.width,
      worldSettings.height
    )
    this.colorMap = colorMap
    this.noiseMap = noiseMap

    for (let x = 0; x < noiseMap.length; x++) {
      for (let y = 0; y < noiseMap[0].length; y++) {
        const hexEntity = this.world.createEntity(`${x}:${y}`)
        hexEntity.addComponent(Position2, { value: new Vector2(x, y) })
        hexEntity.addComponent(Color, { value: colorMap[x][y] })
        hexEntity.addComponent(HexTile)
      }
    }
  }

  execute(delta: any, time: any) {
    // Tile gets added for the first time
    // camera.updateMatrix()
    // camera.updateMatrixWorld()
    counter++
    for (let i = 0; i < this.queries.hexTiles.results.length; i++) {
      const hexEntity = this.queries.hexTiles.results[i]
      const mesh = hexEntity.getComponent(Object3DComponent)

      if (!mesh && this.hexModel) {
        const hexGridPos = hexEntity.getComponent(Position2).value
        const color = hexEntity.getComponent(Color).value

        let material

        if (this.colorMaterials[`${color}`]) {
          material = this.colorMaterials[`${color}`]
        } else {
          this.colorMaterials[`${color}`] = new MeshPhongMaterial({
            color,
          })
        }

        const hexMesh = new Mesh(
          this.hexModel.geometry,
          this.colorMaterials[`${color}`]
        )
        const hexCoords = calcHexLocation(
          hexGridPos.x,
          hexGridPos.y,
          r,
          h,
          false
        )
        hexMesh.position.set(hexCoords.x, 0, hexCoords.y)
        hexMesh.receiveShadow = true
        hexMesh.castShadow = true

        const waterLevel = 0.36
        const terrainHeight =
          this.noiseMap[hexGridPos.x][hexGridPos.y] < waterLevel
            ? waterLevel - 0.2
            : this.noiseMap[hexGridPos.x][hexGridPos.y]

        const hex3dY = terrainHeight ** 4 * 5

        hexEntity.addComponent(TranslateComponent, {
          x: hexCoords.x,
          y: hex3dY - 5,
          z: hexCoords.y,
        })

        hexEntity.addComponent(Object3DComponent, { value: hexMesh })

        if (terrainHeight > waterLevel) {
          mainScene.add(hexMesh)
        } else {
          hexEntity.remove()
        }
      }

      if (mesh && counter % 5 == 0) {
        const frustum = new Frustum()
        frustum.setFromProjectionMatrix(
          new Matrix4().multiplyMatrices(
            camera.projectionMatrix,
            camera.matrixWorldInverse
          )
        )

        // Your 3d point to check
        if (frustum.containsPoint(mesh.value.position)) {
          mesh.value.parent ? null : mainScene.add(mesh.value)
        } else {
          mainScene.remove(mesh.value)
        }
      }
    }
  }
}

TerrainSystem.queries = {
  hexTiles: {
    components: [HexTile],
    listen: {
      added: true,
      removed: true,
      changed: true,
    },
  },
}
