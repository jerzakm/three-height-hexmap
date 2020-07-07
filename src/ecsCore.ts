//@ts-ignore
import { World, Component, System, enableRemoteDevtools } from 'ecsy'
import { TestSystem } from './systems/TestSystem'

let world: World

//todo type
const components: any[] = []
const systems: any[] = [TestSystem]
let lastTime = performance.now()

export const initEcsy = () => {
  world = new World()
  registerAll()
  run()
  // enableRemoteDevtools()
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
