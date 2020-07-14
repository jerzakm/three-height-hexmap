import { System } from 'ecsy'
import { TranslateComponent } from '../../components/TranslateComponent'
import { Object3DComponent } from '../../components/basic/MeshComponent'

export class TranslateSystem extends System {
  // This method will get called on every frame by default
  init() {}

  execute(delta: any, time: any) {
    for (let i = 0; i < this.queries.translate.results.length; i++) {
      const entity = this.queries.translate.results[i]
      const object3d = entity.getComponent(Object3DComponent)
      const moveTo = entity.getComponent(TranslateComponent)
      object3d.value.position.set(moveTo.x, moveTo.y, moveTo.z)
      entity.removeComponent(TranslateComponent)
      // todo easing
    }
  }
}

TranslateSystem.queries = {
  translate: { components: [TranslateComponent] },
}
