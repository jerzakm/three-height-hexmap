import { Vector3, DirectionalLight, Object3D, Vector2, Mesh } from 'three'
import { createType, copyCopyable, cloneClonable } from 'ecsy'

export const ThreeTypes = {
  Vector3: createType({
    name: 'Vector3',
    default: new Vector3(),
    copy: copyCopyable,
    clone: cloneClonable,
  }),
  Vector2: createType({
    name: 'Vector2',
    default: new Vector2(),
    copy: copyCopyable,
    clone: cloneClonable,
  }),
  DirectionalLight: createType({
    name: 'DirectionalLight',
    default: new DirectionalLight(),
    copy: copyCopyable,
    clone: cloneClonable,
  }),
  Mesh: createType({
    name: 'Mesh',
    default: new Mesh(),
    copy: copyCopyable,
    clone: cloneClonable,
  }),
}

export { Types } from 'ecsy'
