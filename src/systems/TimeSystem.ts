import { System } from 'ecsy'
import { TimeComponent } from '../components/TimeComponent'
import { timeStore } from '../stores'

export class TimeSystem extends System {
  // This method will get called on every frame by default
  init() {
    const clock = this.world.createEntity()
    clock.addComponent(TimeComponent, { speed: 2 })
  }

  execute(delta: any, time: any) {
    this.queries.time.results.forEach((entity) => {
      const time = entity.getMutableComponent(TimeComponent)

      // day cycle progress 0 to 1
      time.dayProgress += delta * 0.00001 * time.speed
      time.dayProgress >= 1 ? (time.dayProgress = 0) : ''

      // convert progress to hours and minutes
      // todo optimize math
      const daySecondsTotal = 24 * 60 * 60

      const adjustedProgress = time.dayProgress + 0.3

      const seconds = (daySecondsTotal * time.dayProgress) % 60
      const minutes = ((daySecondsTotal * time.dayProgress) / 60) % 60
      const hours = Math.floor((daySecondsTotal * adjustedProgress) / 3600)
      time.hour = hours > 24 ? hours - 24 : hours
      time.minute = minutes
      time.second = seconds

      timeStore.set({
        dayProgress: time.dayProgress,
        hour: time.hour,
        minute: time.minute,
        second: time.second,
        speed: time.speed,
      })
    })
  }
}

TimeSystem.queries = {
  time: { components: [TimeComponent] },
}
