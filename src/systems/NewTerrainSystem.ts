import { System } from 'ecsy'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import {
  Mesh,
  MeshPhongMaterial,
  BufferGeometry,
  MeshBasicMaterial,
  BufferAttribute,
  VertexColors,
  Color,
  Vector3,
  BoxGeometry,
  Frustum,
  Matrix4,
} from 'three'

import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { generateTerrain } from '../terrainGen'
import { Position2 } from '../components/basic/Position2'

import { HexTile, HexGroup } from '../components/TagComponents'
import { Object3DComponent } from '../components/basic/Object3dComponent'
import { mainScene, camera } from '../three'
import { calcHexLocation } from '../hexGrid/hexMath'
import { TranslateComponent } from '../components/TranslateComponent'
import { worldSettings } from '../main'
import { assets } from '../assets'
import { HexRenderData, IHexRenderData } from '../components/HexRenderData'

const r = 1
const h = 1 * Math.sqrt(3)

const hexHelper = new Mesh(
  assets.hexGeometry,
  new MeshBasicMaterial({ color: 'yellow', wireframe: true })
)

let counter = 0

export class NewTerrainSystem extends System {
  hexModel!: Mesh
  noiseMap!: number[][]
  colorMap!: string[][]
  colorMaterials!: any
  // This method will get called on every frame by default

  init() {
    this.colorMaterials = {}
    //Temporary generation here TODO move outside of terrain system
    const { noiseMap, colorMap } = generateTerrain(
      worldSettings.width,
      worldSettings.height
    )
    this.colorMap = colorMap
    this.noiseMap = noiseMap

    const groupSize = 32
    const groupsQtyX = Math.ceil(worldSettings.width / groupSize)
    const groupsQtyY = Math.ceil(worldSettings.height / groupSize)
    const hexHelper = new Mesh(
      assets.hexGeometry,
      new MeshBasicMaterial({ color: 'yellow', wireframe: true })
    )

    // Loop hex groups
    for (let groupX = 0; groupX < groupsQtyX; groupX++) {
      for (let groupY = 0; groupY < groupsQtyY; groupY++) {
        const hexGroupEntity = this.world.createEntity(
          `hexGroup${groupX};${groupY}`
        )

        const hexRenderData: IHexRenderData[] = []
        // loop over single tiles in a group
        const bounds: Vector3[] = []
        for (let gX = 0; gX < groupSize; gX++) {
          for (let gY = 0; gY < groupSize; gY++) {
            const x = groupX * groupSize + gX
            const y = groupY * groupSize + gY
            const waterLevel = 0.5
            const terrainHeight =
              this.noiseMap[x][y] < waterLevel
                ? waterLevel - 0.2
                : this.noiseMap[x][y]
            const hex3dY = terrainHeight ** 7 * 10
            const hexCoords = calcHexLocation(x, y, r, h, false)

            if (terrainHeight > waterLevel) {
              hexRenderData.push({
                x: hexCoords.x,
                y: hex3dY - 5,
                z: hexCoords.y,
                color: this.colorMap[x][y],
              })
            }

            if (
              gX == 0 ||
              gY == 0 ||
              gY == groupSize - 1 ||
              gY == groupSize - 1
            ) {
              bounds.push(new Vector3(hexCoords.x, hex3dY - 5, hexCoords.y))
            }
          }
        }

        hexGroupEntity.addComponent(HexRenderData, {
          data: hexRenderData,
          bounds,
        })
      }
    }
  }

  execute(delta: any, time: any) {
    counter++
    camera.updateMatrix()
    camera.updateMatrixWorld()

    const frustum = new Frustum()
    frustum.setFromProjectionMatrix(
      new Matrix4().multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
      )
    )

    const startTime = Date.now()

    const hexGroups = this.queries.hexGroup.results
    for (const hexGroup of hexGroups) {
      const hexData = hexGroup.getComponent(HexRenderData)
      // check if the mesh has been generated
      const hasMesh = hexGroup.hasComponent(Object3DComponent)

      // Your 3d point to check
      let inView = false
      for (const bound of hexData.bounds) {
        const buffer = 2

        for (let i = 0; i < 6; i++) {
          if (frustum.planes[i].distanceToPoint(bound) > 0 - buffer) {
            inView = true
          }
        }

        // if (frustum.containsPoint(bound)) {
        //   inView = true
        // }
      }

      if (!hasMesh && inView) {
        const currTime = Date.now()
        const diff = currTime - startTime
        if (diff > 10) {
          break
        }
        const groupGeometries: BufferGeometry[] = []
        for (const hex of hexData.data) {
          hexHelper.position.set(hex.x, hex.y, hex.z)
          const geometry = assets.hexGeometry.clone()
          const c = new Color(hex.color)
          const rgb = [c.r * 255, c.g * 255, c.b * 255]
          // make an array to store colors for each vertex
          const numVerts = geometry.getAttribute('position').count
          const itemSize = 3 // r, g, b
          const colors = new Uint8Array(itemSize * numVerts)
          // copy the color into the colors array for each vertex
          colors.forEach((v, index) => {
            colors[index] = rgb[index % 3]
          })
          const normalized = true
          const colorAttrib = new BufferAttribute(colors, itemSize, normalized)
          geometry.setAttribute('color', colorAttrib)
          hexHelper.updateWorldMatrix(true, false)
          geometry.applyMatrix4(hexHelper.matrixWorld)
          groupGeometries.push(geometry)
        }

        // merge geometries if any exist
        if (groupGeometries.length > 0) {
          const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
            groupGeometries,
            false
          )
          const material = new MeshPhongMaterial({
            //@ts-ignore
            vertexColors: VertexColors,
          })
          const mesh = new Mesh(mergedGeometry, material)
          // mesh.castShadow = true
          // mesh.receiveShadow = true
          mainScene.add(mesh)
          hexGroup.addComponent(Object3DComponent, { value: mesh })
        }
      } else if (hasMesh && counter % 5 == 0) {
        const mesh = hexGroup.getComponent(Object3DComponent).value
        if (inView) {
          if (!mesh.parent) {
            mainScene.add(mesh)
          }
        } else if (!inView && mesh.parent) {
          mainScene.remove(mesh)
        }
      }
    }
  }
}

NewTerrainSystem.queries = {
  hexGroup: {
    components: [HexRenderData],
    listen: {
      added: true,
      removed: true,
      changed: true,
    },
  },
}
