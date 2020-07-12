import { System } from 'ecsy'
import { renderer, mainScene, camera } from '../three'
import { PlaneBufferGeometry, Mesh, MeshPhongMaterial, DoubleSide } from 'three'
import { degToRad } from '../util/math'

export class WaterSystem extends System {
  // This method will get called on every frame by default
  init() {
    const plane = new PlaneBufferGeometry(200, 200)
    const material = new MeshPhongMaterial({
      color: '#225599',
      side: DoubleSide,
    })
    const waterMesh = new Mesh(plane, material)
    waterMesh.receiveShadow = true
    waterMesh.rotateX(degToRad(-90))
    mainScene.add(waterMesh)
  }

  execute(delta: any, time: any) {}
}
