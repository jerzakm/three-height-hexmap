//@ts-ignore
import App from './App.svelte'
import './styles/main.scss'
import { initScene } from './three'

const app = new App({
  target: document.body,
})

initScene()

export default app
