import { System } from 'ecsy'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { Mesh, MeshPhongMaterial, Vector2 } from 'three'
import { generateTerrain } from '../terrainGen'
import { Position2 } from '../components/basic/Position2'
import { Color } from '../components/basic/Color'
import { HexTile } from '../components/basic/TagComponents'
import { Object3DComponent } from '../components/basic/MeshComponent'
import { mainScene } from '../three'
import { calcHexLocation } from '../hexGrid/hexMath'
import { TranslateComponent } from '../components/TranslateComponent'

const r = 1
const h = 1 * Math.sqrt(3)

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
    const { noiseMap, colorMap } = generateTerrain(60, 60)
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
    for (let i = 0; i < this.queries.tileAdd.results.length; i++) {
      const hexEntity = this.queries.tileAdd.results[i]
      const mesh = hexEntity.getComponent(Object3DComponent)
      const hexGridPos = hexEntity.getComponent(Position2).value

      if (!mesh && this.hexModel) {
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

        const waterLevel = 0.42
        const terrainHeight =
          this.noiseMap[hexGridPos.x][hexGridPos.y] < waterLevel
            ? waterLevel - 0.2
            : this.noiseMap[hexGridPos.x][hexGridPos.y]

        const hex3dY = terrainHeight ** 4 * 5

        if (terrainHeight > waterLevel) {
        }
        mainScene.add(hexMesh)

        hexEntity.addComponent(TranslateComponent, {
          x: hexCoords.x - 40,
          y: hex3dY,
          z: hexCoords.y - 40,
        })

        hexEntity.addComponent(Object3DComponent, { value: hexMesh })
      }
    }
  }
}

TerrainSystem.queries = {
  tileAdd: {
    components: [HexTile],
    listen: {
      added: true,
      removed: false,
      changed: false,
    },
  },
}
