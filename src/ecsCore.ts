//@ts-ignore
import { World, Component, System, enableRemoteDevtools } from 'ecsy'
import { RenderSystem } from './systems/RenderSystem'
import { DayNightSystem } from './systems/DayNightSystem'
import { WaterSystem } from './systems/WaterSystem'
import { TimeComponent } from './components/TimeComponent'
import { TimeSystem } from './systems/TimeSystem'
// import * as ecsy from 'ecsy'

let world: World

//todo type
const components: any[] = [TimeComponent]
const systems: any[] = [TimeSystem, WaterSystem, DayNightSystem, RenderSystem]
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
  for (const component of components) {
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
