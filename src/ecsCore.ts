//@ts-ignore
import { World } from 'ecsy'
import { RenderSystem } from './systems/RenderSystem'
import { DayNightSystem } from './systems/DayNightSystem'
import { WaterSystem } from './systems/WaterSystem'
import { TimeComponent } from './components/TimeComponent'
import { TimeSystem } from './systems/TimeSystem'
import { Position3 } from './components/basic/Position3'
import { DirectionalLightComponent } from './components/basic/DirectionalLight'
import { SunTag } from './components/basic/TagComponents'

export let world: World

//todo type
export const componentsList: any[] = [
  TimeComponent,
  Position3,
  DirectionalLightComponent,
  SunTag,
]
export const systems: any[] = [
  TimeSystem,
  WaterSystem,
  DayNightSystem,
  RenderSystem,
]
let lastTime = performance.now()

export const initEcsy = () => {
  world = new World()
  registerAll()
  run()
  setupWorld()
}

function setupWorld() {
  // 1. Time entity
  const clock = world.createEntity()
  clock.addComponent(TimeComponent)
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
