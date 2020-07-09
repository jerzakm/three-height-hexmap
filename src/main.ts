//@ts-ignore
import App from './App.svelte'
import './styles/main.scss'
import { initEcsy } from './ecsCore'
import { initScene } from './three'
import { generateTerrain } from './terrainGen'

const app = new App({
  target: document.body,
})

const terrain = generateTerrain(120, 80)
initScene(terrain)
initEcsy()

export default app
