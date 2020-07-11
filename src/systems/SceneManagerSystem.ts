import { System } from 'ecsy'
import { SceneAdd, SceneRemove } from '../components/basic/TagComponents'
import { mainScene } from '../three'
import { DirectionalLightComponent } from '../components/basic/DirectionalLight'

export class SceneManagerSystem extends System {
  init() {}

  execute(delta: any, time: any) {
    // Handles adding and removing tagged objects from the main scene
    this.queries.directionalLights.results.forEach((entity) => {
      console.log(entity)
      mainScene.add(entity.getComponent(DirectionalLightComponent).value)
      entity.removeComponent(SceneAdd)
    })
  }
}

SceneManagerSystem.queries = {
  directionalLights: { components: [SceneAdd, DirectionalLightComponent] },
}
