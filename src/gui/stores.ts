import { writable } from 'svelte/store'

export const timeStore = writable({
  dayProgress: 0,
  hour: 0,
  minute: 0,
  second: 0,
  speed: 1,
})
