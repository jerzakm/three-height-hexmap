import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  BasicShadowMap,
  GammaEncoding,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export const renderer = new WebGLRenderer({ antialias: true })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = BasicShadowMap
// @ts-ignore
renderer.outputEncoding = GammaEncoding
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

export const mainScene = new Scene()

export const camera = new PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  2000
)

camera.position.set(20, 50, 20) // all components equal
camera.lookAt(mainScene.position) // or the origin

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(-1, 1, -0.5)
controls.update()

export const initScene = () => {
  document.body.appendChild(renderer.domElement)
  renderer.domElement.style.position = 'fixed'

  window.addEventListener('resize', onWindowResize, false)
  onWindowResize()
}

function onWindowResize() {
  // camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}
