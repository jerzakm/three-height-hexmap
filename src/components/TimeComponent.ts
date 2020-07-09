import { Component, Types } from 'ecsy'

export class TimeComponent extends Component<any> {
  dayProgress!: number
  hour!: number
  minute!: number
  second!: number
  speed!: number

  static schema = {
    hour: { type: Types.Number, default: 0 },
    minute: { type: Types.Number, default: 0 },
    second: { type: Types.Number, default: 0 },
    dayProgress: { type: Types.Number, default: 0 },
    speed: { type: Types.Number, default: 1 },
  }
}
