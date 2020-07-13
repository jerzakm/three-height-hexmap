//@ts-ignore
import App from './App.svelte'
import './styles/main.scss'
import { initEcsy } from './ecsCore'
import { initScene } from './three'
import { generateTerrain } from './terrainGen'

const app = new App({
  target: document.body,
})

const terrain = generateTerrain(20, 20)
initScene()
initEcsy()

export default app
