//@ts-ignore
import { System } from 'ecsy'
import {
  AmbientLight,
  PointLight,
  DirectionalLight,
  HemisphereLight,
} from 'three'
import { mainScene } from '../three'

export class DayNightSystem extends System {
  // This method will get called on every frame by default

  init() {
    var hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.6)
    hemiLight.color.setHSL(0.6, 0.75, 0.5)
    hemiLight.groundColor.setHSL(0.095, 0.5, 0.5)
    hemiLight.position.set(0, 500, 0)
    mainScene.add(hemiLight)

    var dirLight = new DirectionalLight(0xffffff, 1)
    dirLight.position.set(-1, 0.75, 1)
    dirLight.position.multiplyScalar(50)
    dirLight.name = 'dirlight'
    // dirLight.shadowCameraVisible = true;

    mainScene.add(dirLight)

    dirLight.castShadow = true
    dirLight.shadowMapWidth = dirLight.shadowMapHeight = 1024 * 2

    var d = 300

    dirLight.shadowMapHeight = 4096 * 100
    dirLight.shadowMapWidth = 4096 * 100
    dirLight.shadowCameraLeft = -d
    dirLight.shadowCameraRight = d
    dirLight.shadowCameraTop = d
    dirLight.shadowCameraBottom = -d

    dirLight.shadowCameraFar = 3500
    dirLight.shadowBias = 0.00001
  }

  execute(delta: any, time: any) {}
}
