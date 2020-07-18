//@ts-ignore
import App from './App.svelte'
import './styles/main.scss'
import { initEcsy } from './ecsCore'
import { initScene } from './three'
import { generateTerrain } from './terrainGen'

const app = new App({
  target: document.body,
})

export const worldSettings = {
  width: 64,
  height: 64,
}

initScene()
initEcsy()

export default app
