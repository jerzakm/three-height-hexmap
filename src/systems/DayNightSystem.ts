//@ts-ignore
import { System, Entity } from 'ecsy'
import {
  HemisphereLight,
  Mesh,
  SphereGeometry,
  MeshBasicMaterial,
  AmbientLight,
  DirectionalLight,
  Vector3,
} from 'three'
import { mainScene } from '../three'
import { degToRad } from '../util/math'
import { TimeComponent } from '../components/TimeComponent'
import { Position3 } from '../components/basic/Position3'
import { DirectionalLightComponent } from '../components/basic/DirectionalLight'
import { SunTag } from '../components/basic/TagComponents'

const sunSpeed = 0.00001

export class DayNightSystem extends System {
  // This method will get called on every frame by default
  sunLight?: DirectionalLightComponent
  hemi?: HemisphereLight
  ambient?: AmbientLight
  sunHelper?: Mesh

  init() {
    // Create sun
    const sun = this.world.createEntity('sun')
    sun.addComponent(Position3, { value: new Vector3(1, 1, 0) })

    // configure sun light
    const sunLight = new DirectionalLight(0xffffcc, 0.2)
    mainScene.add(sunLight)

    sunLight.name = 'dirlight'
    sunLight.position.set(-1, 0.75, 1)
    sunLight.position.multiplyScalar(50)
    sunLight.castShadow = true
    sunLight.shadowMapWidth = sunLight.shadowMapHeight = 1024 * 2
    const d = 300
    sunLight.shadowMapHeight = 4096 * 100
    sunLight.shadowMapWidth = 4096 * 100
    sunLight.shadowCameraLeft = -d
    sunLight.shadowCameraRight = d
    sunLight.shadowCameraTop = d
    sunLight.shadowCameraBottom = -d

    sunLight.shadowCameraFar = 3500
    sunLight.shadowBias = 0.00001

    sun.addComponent(DirectionalLightComponent, {
      value: sunLight,
    })
    sun.addComponent(SunTag)

    const hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.25)
    hemiLight.color.setHSL(0.6, 0.75, 0.5)
    hemiLight.groundColor.setHSL(0.095, 0.5, 0.5)
    hemiLight.position.set(0, 500, 0)
    mainScene.add(hemiLight)
    this.hemi = hemiLight

    const ambientLight = new AmbientLight('#FFFFFF', 0.3)
    this.ambient = ambientLight

    // mainScene.add(ambientLight)

    const geometry = new SphereGeometry(2)
    const material = new MeshBasicMaterial({ color: '#CCCC00' })
    this.sunHelper = new Mesh(geometry, material)
    mainScene.add(this.sunHelper)
  }

  execute(delta: any, time: any) {
    const sunTravelRadius = 250

    const sun = this.queries.sun.results[0]

    this.queries.time.results.forEach((timeEntity) => {
      const dayProgress = timeEntity.getComponent(TimeComponent).dayProgress

      const angle = degToRad(360 * dayProgress)

      const x = Math.cos(angle) * sunTravelRadius
      const y = Math.sin(angle) * sunTravelRadius

      // Sun rises up
      if (!this.ambient || !sun) {
        return
      }
      if (dayProgress > 0 && dayProgress < 0.5) {
        if (dayProgress < 0.25) {
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

      const sunPosition = sun.getMutableComponent(Position3)
      sunPosition.value.set(x, y, 150)

      const sunLight = sun.getMutableComponent(DirectionalLightComponent)

      sunLight.value.position.x = sunPosition.value.x

      sunLight.value.position.set(
        sunPosition.value.x,
        sunPosition.value.y,
        sunPosition.value.z
      )

      if (this.sunHelper) {
        this.sunHelper.position.set(
          sunPosition.value.x,
          sunPosition.value.y,
          sunPosition.value.z
        )
      }
    })
  }
}

DayNightSystem.queries = {
  time: { components: [TimeComponent] },
  sun: {
    components: [SunTag],
  },
}
