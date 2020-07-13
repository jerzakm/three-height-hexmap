import { System } from 'ecsy'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { Mesh, Object3D, MeshPhongMaterial, Vector2, Vector3 } from 'three'
import { generateTerrain } from '../terrainGen'
import { Position3 } from '../components/basic/Position3'
import { Position2 } from '../components/basic/Position2'
import { Color } from '../components/basic/Color'
import { HexTile } from '../components/basic/TagComponents'
import { MeshComponent } from '../components/basic/MeshComponent'
import { mainScene } from '../three'
import { calcHexLocation } from '../hexGrid/hexMath'

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
    const { noiseMap, colorMap } = generateTerrain(60, 50)
    this.colorMap = colorMap
    this.noiseMap = noiseMap

    for (let x = 0; x < noiseMap.length; x++) {
      for (let y = 0; y < noiseMap[0].length; y++) {
        const hexEntity = this.world.createEntity(`${x}:${y}`)
        hexEntity.addComponent(Position3)
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
      const mesh = hexEntity.getComponent(MeshComponent)
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
        hexMesh.position.set(hexCoords.x, -20, hexCoords.y)
        hexMesh.receiveShadow = true
        hexMesh.castShadow = true
        mainScene.add(hexMesh)
        hexEntity.addComponent(MeshComponent, { value: hexMesh })

        hexEntity
          .getMutableComponent(Position3)
          .value.set(
            hexCoords.x,
            this.noiseMap[hexGridPos.x][hexGridPos.y] * 8,
            hexCoords.y
          )
      }
    }

    // Tile position3 changes
    let out = 0
    for (let i = 0; i < this.queries.heightChange.results.length; i++) {
      const hexEntity = this.queries.heightChange.results[i]
      const mesh = hexEntity.getMutableComponent(MeshComponent).value

      const position3 = hexEntity.getComponent(Position3).value

      const animSpeed = 3 * delta

      const diffX = position3.x - mesh.position.x
      const calcX = mesh.position.x + diffX / animSpeed

      const diffY = position3.y - mesh.position.y
      const calcY = mesh.position.y + diffY / animSpeed

      const diffZ = position3.z - mesh.position.z
      const calcZ = mesh.position.z + diffZ / animSpeed

      mesh.position.set(
        Math.abs(diffX) < 0.1 ? position3.x : calcX,
        Math.abs(diffY) < 0.1 ? position3.y : calcY,
        Math.abs(diffZ) < 0.1 ? position3.z : calcZ
      )
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
  heightChange: {
    components: [HexTile, Position3, MeshComponent],
    listen: {
      added: false,
      removed: false,
      changed: true,
    },
  },
}
