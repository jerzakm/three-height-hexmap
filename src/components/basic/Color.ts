import { Component, Types } from 'ecsy'

export class Color extends Component<any> {
  value!: string
  static schema = {
    value: { type: Types.String, default: '#FFFF00' },
  }
}
