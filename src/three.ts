import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  TextureLoader,
  BasicShadowMap,
  MeshPhongMaterial,
  PointLight,
  NearestFilter,
  RepeatWrapping,
  PlaneGeometry,
  Mesh,
} from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { calcHexLocation } from './hexGrid/hexMath'

export const renderer = new WebGLRenderer({ antialias: true, alpha: true })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = BasicShadowMap

export const mainScene = new Scene()

var aspect = window.innerWidth / window.innerHeight
var d = 10
// const camera = new OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000)
export const camera = new PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  2000
)

camera.position.set(20, 50, 20) // all components equal
camera.lookAt(mainScene.position) // or the origin

const ambientLight = new AmbientLight('0xFFFFCC', 0.75)

const sun = new PointLight('#FFFFAA', 0.2, 500)
sun.position.set(5, 50, 20)
sun.castShadow = true
mainScene.add(sun)
sun.shadow.mapSize.width = 4096 * 2
sun.shadow.mapSize.height = 4096 * 2

const objLoader = new OBJLoader()
const textureLoader = new TextureLoader()

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(-1, 1, -0.5)
controls.update()

export const initScene = (terrainCanvas: HTMLCanvasElement) => {
  document.body.appendChild(renderer.domElement)
  renderer.domElement.style.position = 'fixed'

  mainScene.add(ambientLight)

  window.addEventListener('resize', onWindowResize, false)
  onWindowResize()
  loadHex(terrainCanvas)
}

function loadHex(terrainCanvas: HTMLCanvasElement) {
  objLoader.load('hexagon.obj', (group) => {
    const texture = textureLoader.load('hexagon.png')
    texture.magFilter = NearestFilter
    texture.wrapS = RepeatWrapping
    const material = new MeshPhongMaterial({
      // map: texture,
      color: '#EEEFFF',
    })
    //@ts-ignore
    group.children[0].material = material
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
          mainScene.add(newHex)
        }
      }

      // //water
      // const waterPlane = new PlaneGeometry(
      //   terrainCanvas.width * 2,
      //   terrainCanvas.height * 2
      // )
      // const material = new MeshPhongMaterial({
      //   // map: texture,
      //   color: '#2222FF',
      //   opacity: 0.01,
      // })
      // const waterMesh = new Mesh(waterPlane, material)
      // waterMesh.rotateX(270 * (Math.PI / 180))
      // waterMesh.position.set(
      //   terrainCanvas.width / 2,
      //   20,
      //   terrainCanvas.height / 2
      // )
      // mainScene.add(waterMesh)
    }

    mainScene.add(group)
  })
}

function onWindowResize() {
  // camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}
