//@ts-ignore
import { System } from 'ecsy'

export class TestSystem extends System {
  // This method will get called on every frame by default
  execute(delta: any, time: any) {
    // Iterate through all the entities on the query
    console.log('testSystem')
  }
}
