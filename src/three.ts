import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  TextureLoader,
  BasicShadowMap,
  MeshPhongMaterial,
  NearestFilter,
  RepeatWrapping,
} from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { calcHexLocation } from './hexGrid/hexMath'

export const renderer = new WebGLRenderer({ antialias: true, alpha: true })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = BasicShadowMap

export const mainScene = new Scene()

export const camera = new PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  2000
)

camera.position.set(20, 50, 20) // all components equal
camera.lookAt(mainScene.position) // or the origin

const objLoader = new OBJLoader()
const textureLoader = new TextureLoader()

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(-1, 1, -0.5)
controls.update()

export const initScene = (terrainCanvas: HTMLCanvasElement) => {
  document.body.appendChild(renderer.domElement)
  renderer.domElement.style.position = 'fixed'

  window.addEventListener('resize', onWindowResize, false)
  onWindowResize()
  loadHex(terrainCanvas)
}

function loadHex(terrainCanvas: HTMLCanvasElement) {
  objLoader.load('hexagon.obj', (group) => {
    const texture = textureLoader.load('hexagon.png')
    texture.magFilter = NearestFilter
    texture.wrapS = RepeatWrapping
    const hexagon = group.children[0]

    const ctx = terrainCanvas.getContext('2d')

    if (ctx) {
      for (let x = 0; x < terrainCanvas.width; x++) {
        for (let y = 0; y < terrainCanvas.height; y++) {
          const height = ctx.getImageData(x, y, 1, 1).data[0] / 7 - 5

          const r = 1
          const location = calcHexLocation(x, y, r, r * Math.sqrt(3), false)
          const newHex = hexagon.clone()
          newHex.castShadow = true
          newHex.receiveShadow = true
          newHex.position.set(location.x - 50, height, location.y - 50)

          const material = new MeshPhongMaterial({
            // color: Math.random() > 0.5 ? '#66CC22' : '#2233AA',
            map: texture,
          })
          //@ts-ignore
          newHex.material = material

          mainScene.add(newHex)
        }
      }
    }
  })
}

function onWindowResize() {
  // camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}
