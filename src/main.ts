//@ts-ignore
import App from './App.svelte'
import './styles/main.scss'
// import { initEcsy } from './ecsCore'
import { initScene } from './three'

const app = new App({
  target: document.body,
})

// initEcsy()
initScene()

export default app
