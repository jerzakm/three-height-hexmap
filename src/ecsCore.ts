//@ts-ignore
import { World } from 'ecsy'
import { RenderSystem } from './systems/renderSystems/RenderSystem'
import { DayNightSystem } from './systems/DayNightSystem'
import { WaterSystem } from './systems/WaterSystem'
import { TimeComponent } from './components/TimeComponent'
import { TimeSystem } from './systems/TimeSystem'
import { Position3 } from './components/basic/Position3'
import {
  SunTag,
  SceneAdd,
  SceneRemove,
  HexTile,
  HexGroup,
} from './components/TagComponents'
import { SceneManagerSystem } from './systems/renderSystems/SceneManagerSystem'
import { DirectionalLightComponent } from './components/basic/DirectionalLight'
import { Object3DComponent } from './components/basic/Object3dComponent'
import { Position2 } from './components/basic/Position2'
import { Color } from './components/basic/Color'
import { TranslateSystem } from './systems/renderSystems/TranslateSystem'
import { TranslateComponent } from './components/TranslateComponent'
import { HexRenderData } from './components/HexRenderData'
import { NewTerrainSystem } from './systems/NewTerrainSystem'

export let world: World

//todo type
export const componentsList: any[] = [
  TimeComponent,
  Position2,
  Position3,
  DirectionalLightComponent,
  SunTag,
  SceneAdd,
  SceneRemove,
  Color,
  HexTile,
  HexGroup,
  Object3DComponent,
  TranslateComponent,
  HexRenderData,
]
export const systems: any[] = [
  TimeSystem,
  WaterSystem,
  DayNightSystem,
  RenderSystem,
  SceneManagerSystem,
  TranslateSystem,
  // TerrainSystem,
  NewTerrainSystem,
]
let lastTime = performance.now()

export const initEcsy = () => {
  world = new World()
  registerAll()
  run()
}

function registerAll() {
  for (const component of componentsList) {
    world.registerComponent(component)
  }
  for (const system of systems) {
    world.registerSystem(system)
  }
}

function run() {
  // Compute delta and elapsed time
  var time = performance.now()
  var delta = time - lastTime

  // Run all the systems
  world.execute(delta, time)

  lastTime = time
  requestAnimationFrame(run)
}
