import { System } from 'ecsy'
import { TimeComponent } from '../components/TimeComponent'

export class TimeSystem extends System {
  // This method will get called on every frame by default
  init() {}

  execute(delta: any, time: any) {
    this.queries.time.results.forEach((entity) => {
      const time = entity.getMutableComponent(TimeComponent)
      console.log(time)
      // day cycle progress 0 to 1
      time.dayProgress += delta * 0.00001 * time.speed
      time.dayProgress >= 1 ? (time.dayProgress = 0) : ''

      // convert progress to hours and minutes
      // todo optimize math
      const daySecondsTotal = 24 * 60 * 60

      const seconds = (daySecondsTotal * time.dayProgress) % 60
      const minutes = ((daySecondsTotal * time.dayProgress) / 60) % 60
      const hours = Math.floor((daySecondsTotal * time.dayProgress) / 3600)
      time.hour = hours
      time.minute = minutes
      time.second = seconds
    })
  }
}

TimeSystem.queries = {
  time: { components: [TimeComponent] },
}
