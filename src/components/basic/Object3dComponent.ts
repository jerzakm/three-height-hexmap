import { Component, Types } from 'ecsy'
import { ThreeTypes } from '../../types/threeTypes'
import { Object3D } from 'three'

export class Object3DComponent extends Component<any> {
  value!: Object3D
  static schema = {
    value: { type: Types.Ref },
  }
}
