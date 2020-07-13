import { Component, Types } from 'ecsy'
import { ThreeTypes } from '../../types/threeTypes'
import { Mesh } from 'three'

export class MeshComponent extends Component<any> {
  value!: Mesh
  static schema = {
    value: { type: Types.Ref },
  }
}
