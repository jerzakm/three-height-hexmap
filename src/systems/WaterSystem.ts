import { System } from 'ecsy'
import { Water } from 'three/examples/jsm/objects/Water.js'
import { mainScene, renderer, camera } from '../three'
import {
  PlaneBufferGeometry,
  TextureLoader,
  RepeatWrapping,
  Vector3,
  Mesh,
} from 'three'

import { Ocean } from 'three/examples/jsm/misc/Ocean.js'
// let water: any

let ocean: any

export class WaterSystem extends System {
  // This method will get called on every frame by default
  init() {
    // var waterGeometry = new PlaneBufferGeometry(200, 200)
    // water = new Water(waterGeometry, {
    //   textureWidth: 512,
    //   textureHeight: 512,
    //   waterNormals: new TextureLoader().load('waternormals.jpg', function (
    //     texture
    //   ) {
    //     texture.wrapS = texture.wrapT = RepeatWrapping
    //   }),
    //   alpha: 1.0,
    //   sunDirection: new Vector3(),
    //   sunColor: 0xffffff,
    //   waterColor: 0x001e1f,
    //   distortionScale: 20,
    //   fog: mainScene.fog !== undefined,
    // })
    // water.rotation.x = -Math.PI / 2
    // water.position.set(0, 14, 0)
    // mainScene.add(water)
    // water.receiveShadow = true

    var gsize = 256
    var res = 1024
    var gres = res / 2
    var origx = -gsize / 2
    var origz = -gsize / 2

    let c: any = camera

    ocean = new Ocean(renderer, c, mainScene, {
      USE_HALF_FLOAT: false,
      INITIAL_SIZE: 512.0 * 32,
      INITIAL_WIND: [4.0, 4.0],
      INITIAL_CHOPPINESS: 8,
      CLEAR_COLOR: [1.0, 1.0, 1.0, 0.0],
      GEOMETRY_ORIGIN: [origx, origz],
      SUN_DIRECTION: [-1.0, 1.0, 1.0],
      OCEAN_COLOR: new Vector3(0.004, 0.016, 0.047),
      SKY_COLOR: new Vector3(3.2, 9.6, 12.8),
      EXPOSURE: 0.55,
      GEOMETRY_RESOLUTION: gres,
      GEOMETRY_SIZE: gsize,
      RESOLUTION: res,
    })

    ocean.materialOcean.uniforms['u_projectionMatrix'] = {
      value: c.projectionMatrix,
    }
    ocean.materialOcean.uniforms['u_viewMatrix'] = {
      value: c.matrixWorldInverse,
    }
    ocean.materialOcean.uniforms['u_cameraPosition'] = { value: c.position }
    mainScene.add(ocean.oceanMesh)
  }

  execute(delta: any, time: any) {
    // water.material.uniforms['time'].value += delta / 10000
    //   water.material.uniforms['sunDirection'].value.copy(new Vector3(1, 1, 1))
    ocean.deltaTime = delta / 1000 || 0.0
    ocean.render(ocean.deltaTime)
    ocean.overrideMaterial = ocean.materialOcean

    if (ocean.changed) {
      ocean.materialOcean.uniforms['u_size'].value = ocean.size
      ocean.materialOcean.uniforms['u_sunDirection'].value.set(
        ocean.sunDirectionX,
        ocean.sunDirectionY,
        ocean.sunDirectionZ
      )
      ocean.materialOcean.uniforms['u_exposure'].value = ocean.exposure
      ocean.changed = false
    }

    ocean.materialOcean.uniforms['u_normalMap'].value =
      ocean.normalMapFramebuffer.texture
    ocean.materialOcean.uniforms['u_displacementMap'].value =
      ocean.displacementMapFramebuffer.texture
    ocean.materialOcean.uniforms['u_projectionMatrix'].value =
      camera.projectionMatrix
    ocean.materialOcean.uniforms['u_viewMatrix'].value =
      camera.matrixWorldInverse
    ocean.materialOcean.uniforms['u_cameraPosition'].value = camera.position
    ocean.materialOcean.depthTest = true
  }
}
