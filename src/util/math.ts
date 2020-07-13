export const degToRad = (degrees: number) => {
  return degrees * (Math.PI / 180)
}

export const clamp = (value: number, min: number, max: number) => {
  return value < min ? min : value > max ? max : value
}

export const inverseLerp = (a: number, b: number, value: number) => {
  return (clamp(value, Math.min(a, b), Math.max(a, b)) - a) / (b - a)
}
