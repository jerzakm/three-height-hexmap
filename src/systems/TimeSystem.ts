import { System } from 'ecsy'
import { TimeComponent } from '../components/TimeComponent'

export class TimeSystem extends System {
  // This method will get called on every frame by default
  init() {}

  execute(delta: any, time: any) {
    this.queries.time.results.forEach((entity) => {
      const time = entity.getMutableComponent(TimeComponent)

      // day cycle progress 0 to 1
      time.dayProgres += delta * 0.00001 * time.speed
      time.dayProgres >= 1 ? (time.dayProgres = 0) : ''

      // convert progress to hours and minutes
      // todo optimize math
      const daySecondsTotal = 24 * 60 * 60

      const seconds = (daySecondsTotal * time.dayProgres) % 60
      const minutes = ((daySecondsTotal * time.dayProgres) / 60) % 60
      const hours = Math.floor((daySecondsTotal * time.dayProgres) / 360)
      time.hour = hours
      time.minute = minutes
      time.second = seconds
    })
  }
}

TimeSystem.queries = {
  time: { components: [TimeComponent] },
}
