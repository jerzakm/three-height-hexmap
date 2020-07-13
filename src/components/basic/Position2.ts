import { Component } from 'ecsy'
import { ThreeTypes } from '../../types/threeTypes'
import { Vector2 } from 'three'

export class Position2 extends Component<any> {
  value!: Vector2
  static schema = {
    value: { type: ThreeTypes.Vector2, default: new Vector2(0, 0) },
  }
}
