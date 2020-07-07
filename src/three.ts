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
} from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { calcHexLocation } from './hexGrid/hexMath'

const renderer = new WebGLRenderer({ antialias: true, alpha: true })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = BasicShadowMap

const scene = new Scene()

var aspect = window.innerWidth / window.innerHeight
var d = 10
// const camera = new OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000)
const camera = new PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  2000
)

camera.position.set(20, 50, 20) // all components equal
camera.lookAt(scene.position) // or the origin

const ambientLight = new AmbientLight('0xFFFFCC', 0.75)

const sun = new PointLight('#FFFFAA', 0.2, 500)
sun.position.set(5, 20, 20)
sun.castShadow = true
scene.add(sun)
sun.shadow.mapSize.width = 4096 * 2
sun.shadow.mapSize.height = 4096 * 2

const objLoader = new OBJLoader()
const textureLoader = new TextureLoader()

const controls = new OrbitControls(camera, renderer.domElement)
controls.addEventListener('change', render) // use if there is no animation loop
controls.target.set(-1, 1, -0.5)
controls.update()

export const initScene = () => {
  document.body.appendChild(renderer.domElement)
  renderer.domElement.style.position = 'fixed'

  scene.add(ambientLight)

  window.addEventListener('resize', onWindowResize, false)
  onWindowResize()
  loadHex()
  render()
}

function loadHex() {
  objLoader.load('hexagon.obj', (group) => {
    const texture = textureLoader.load('hexagon.png')
    texture.magFilter = NearestFilter
    texture.wrapS = RepeatWrapping
    const material = new MeshPhongMaterial({
      // map: texture,
      color: '#EEEFFF',
    })
    console.log(group.children[0])
    //@ts-ignore
    group.children[0].material = material
    const hexagon = group.children[0]

    for (let x = 0; x < 80; x++) {
      for (let y = 0; y < 80; y++) {
        const r = 1
        const location = calcHexLocation(x, y, r, r * Math.sqrt(3), false)
        const newHex = hexagon.clone()
        newHex.castShadow = true
        newHex.receiveShadow = true
        newHex.position.set(location.x - 50, Math.random() * 2, location.y - 50)
        scene.add(newHex)
      }
    }

    scene.add(group)
    render()
  })
}

function onWindowResize() {
  // camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

function render() {
  renderer.render(scene, camera)
}
