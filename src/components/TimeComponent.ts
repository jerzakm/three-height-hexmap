import { Component, Types } from 'ecsy'

export class TimeComponent extends Component<any> {
  dayProgres: number
  hour: number
  minute: number
  second: number
  speed: number
  constructor() {
    super()
    this.dayProgres = 0
    this.hour = 0
    this.minute = 0
    this.speed = 1
    this.second = 0
  }
}
