//@ts-ignore
import { System } from 'ecsy'
import {
  DirectionalLight,
  HemisphereLight,
  Mesh,
  SphereGeometry,
  MeshBasicMaterial,
  AmbientLight,
} from 'three'
import { mainScene } from '../three'
import { degToRad } from '../util/math'

const sunTravel = true
const sunSpeed = 0.0001

export class DayNightSystem extends System {
  // This method will get called on every frame by default
  sun?: DirectionalLight
  hemi?: HemisphereLight
  ambient?: AmbientLight
  sunHelper?: Mesh
  sunPosition?: {
    radius: number
    progress: number
  }

  init() {
    const hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.25)
    hemiLight.color.setHSL(0.6, 0.75, 0.5)
    hemiLight.groundColor.setHSL(0.095, 0.5, 0.5)
    hemiLight.position.set(0, 500, 0)
    mainScene.add(hemiLight)
    this.hemi = hemiLight

    const ambientLight = new AmbientLight('#FFFFFF', 0.3)
    this.ambient = ambientLight

    mainScene.add(ambientLight)

    const dirLight = new DirectionalLight(0xffffcc, 0.2)
    dirLight.position.set(-1, 0.75, 1)
    dirLight.position.multiplyScalar(50)
    dirLight.name = 'dirlight'
    // dirLight.shadowCameraVisible = true;
    this.sun = dirLight
    mainScene.add(dirLight)

    dirLight.castShadow = true
    dirLight.shadowMapWidth = dirLight.shadowMapHeight = 1024 * 2

    const d = 300

    dirLight.shadowMapHeight = 4096 * 100
    dirLight.shadowMapWidth = 4096 * 100
    dirLight.shadowCameraLeft = -d
    dirLight.shadowCameraRight = d
    dirLight.shadowCameraTop = d
    dirLight.shadowCameraBottom = -d

    dirLight.shadowCameraFar = 3500
    dirLight.shadowBias = 0.00001

    const geometry = new SphereGeometry(2)
    const material = new MeshBasicMaterial({ color: '#CCCC00' })
    this.sunHelper = new Mesh(geometry, material)
    mainScene.add(this.sunHelper)

    this.sunPosition = {
      progress: 0,
      radius: 150,
    }
  }

  execute(delta: any, time: any) {
    if (this.sun && this.sunPosition && this.hemi && this.ambient) {
      if (sunTravel) {
        const angle = degToRad(360 * this.sunPosition.progress)

        const x = Math.cos(angle) * this.sunPosition.radius
        const y = Math.sin(angle) * this.sunPosition.radius

        // Sun rises up
        if (this.sunPosition.progress > 0 && this.sunPosition.progress < 0.5) {
          if (this.sunPosition.progress < 0.25) {
            // sun brigthens up
            this.ambient.intensity += delta * sunSpeed * 2
          } else {
            // sun dims
            this.ambient.intensity -= delta * sunSpeed * 2
          }
        } else {
          // reset to 0 - night
          this.ambient.intensity = 0
        }

        this.sunPosition.progress > 1
          ? (this.sunPosition.progress = 0)
          : (this.sunPosition.progress += delta * sunSpeed)

        this.sun.position.set(x, y, 80)
      }

      if (this.sunHelper) {
        this.sunHelper.position.set(
          this.sun.position.x,
          this.sun.position.y,
          this.sun.position.z
        )
      }
    }
  }
}
