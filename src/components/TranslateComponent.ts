import { Component, Types } from 'ecsy'

export class TranslateComponent extends Component<any> {
  x!: number
  y!: number
  z!: number
  easing!: string
  progress!: number

  static schema = {
    x: { type: Types.Number, default: 0 },
    y: { type: Types.Number, default: 0 },
    z: { type: Types.Number, default: 0 },
    easing: { type: Types.Number, default: 'linear' },
    progress: { type: Types.Number, default: 0 },
  }
}
