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
import { SunTag, SceneAdd } from '../components/basic/TagComponents'
import { DirectionalLightComponent } from '../components/basic/DirectionalLight'

const sunSpeed = 0.00001

export class DayNightSystem extends System {
  // This method will get called on every frame by default
  hemi?: HemisphereLight
  ambient?: AmbientLight
  sunHelper?: Mesh

  init() {
    // configure sun light
    const sunLight = new DirectionalLight(0xffffcc, 0.2)

    sunLight.name = 'dirlight'
    sunLight.position.set(-1, 0.75, 1)
    sunLight.position.multiplyScalar(50)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = sunLight.shadow.mapSize.height = 4096 * 100
    const d = 300
    sunLight.shadow.camera.left = -d
    sunLight.shadow.camera.right = d
    sunLight.shadow.camera.top = d
    sunLight.shadow.camera.bottom = -d

    sunLight.shadow.camera.far = 3500
    sunLight.shadow.bias = 0.00001

    // Create sun
    const sun = this.world.createEntity('sun')
    sun.addComponent(Position3, { value: new Vector3(1, 1, 0) })
    sun.addComponent(DirectionalLightComponent, {
      value: sunLight,
    })
    sun.addComponent(SunTag)
    sun.addComponent(SceneAdd)

    const hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.1)
    hemiLight.color.setHSL(0.6, 0.75, 0.5)
    hemiLight.groundColor.setHSL(0.095, 0.5, 0.5)
    hemiLight.position.set(0, 500, 0)
    mainScene.add(hemiLight)
    this.hemi = hemiLight

    const ambientLight = new AmbientLight('#FFFFFF', 0.3)
    this.ambient = ambientLight

    mainScene.add(ambientLight)

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

      if (dayProgress > 0 && dayProgress < 0.5) {
        if (dayProgress < 0.25) {
          // sun brigthens up
          // @ts-ignore
          this.ambient.intensity += delta * sunSpeed * 2
        } else {
          // sun dims
          // @ts-ignore
          this.ambient.intensity -= delta * sunSpeed * 2
        }
      } else {
        // reset to 0 - night
        // @ts-ignore
        this.ambient.intensity = 0
      }

      const sunPosition = sun.getMutableComponent(Position3)
      sunPosition.value.set(x, y, 150)

      const sunLight = sun.getMutableComponent(DirectionalLightComponent)

      console.log(sunLight.value)

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
