import { Component } from 'ecsy'
import { ThreeTypes } from '../../types/threeTypes'
import { DirectionalLight } from 'three'

export class DirectionalLightComponent extends Component<any> {
  value!: DirectionalLight
  static schema = {
    value: { type: ThreeTypes.DirectionalLight },
  }
}
