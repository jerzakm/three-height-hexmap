import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

const objLoader = new OBJLoader()

export const assets = Object.create(null)

export const loadAssets = async () => {
  await loadHex()
}

function loadHex() {
  return new Promise((resolve, reject) => {
    objLoader.load('hexagon.obj', (group: any) => {
      assets.hexGeometry = group.children[0].geometry
      resolve()
    })
  })
}
