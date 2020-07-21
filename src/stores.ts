import { writable } from 'svelte/store'

export const timeStore = writable({
  dayProgress: 0,
  hour: 0,
  minute: 0,
  second: 0,
  speed: 1,
})

export const worldSettingsStore = writable({
  width: 32 * 32,
  height: 32 * 32,
  meshGroupSize: 32,
})

export const meshGroupsRendered = writable(0)
