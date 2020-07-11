import { Vector3, DirectionalLight } from 'three'
import { createType, copyCopyable, cloneClonable } from 'ecsy'

export const ThreeTypes = {
  Vector3: createType({
    name: 'Vector3',
    default: new Vector3(),
    copy: copyCopyable,
    clone: cloneClonable,
  }),
  DirectionalLight: createType({
    name: 'DirectionalLight',
    default: new DirectionalLight(),
    copy: copyCopyable,
    clone: cloneClonable,
  }),
}

export { Types } from 'ecsy'
