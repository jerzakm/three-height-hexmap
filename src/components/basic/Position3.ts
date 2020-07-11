import { Component, Types } from 'ecsy'
import { ThreeTypes } from '../../types/threeTypes'
import { Vector3 } from 'three'

export class Position3 extends Component<any> {
  value!: Vector3
  static schema = {
    value: { type: ThreeTypes.Vector3, default: new Vector3(0, 0, 0) },
  }
}
