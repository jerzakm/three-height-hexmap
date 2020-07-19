import { Component, Types } from 'ecsy'
import { Vector3 } from 'three'

export class HexRenderData extends Component<any> {
  data!: IHexRenderData[]
  bounds!: Vector3[]

  static schema = {
    data: { type: Types.Array, default: [] },
    bounds: { type: Types.Array, default: [] },
  }
}

export interface IHexRenderData {
  x: number
  y: number
  z: number
  color: string
}
