//@ts-ignore
import App from './App.svelte'
import './styles/main.scss'
// import { initEcsy } from './ecsCore'
import { initScene } from './three'
import { generateTerrain } from './terrainGen'

const app = new App({
  target: document.body,
})

// initEcsy()
const terrain = generateTerrain(120, 80)
initScene(terrain)

export default app
