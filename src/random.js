// Inefficient but OK for small ranges
function range(start, end) {
  if (start === end) return [start]
  return [start, ...range(start + 1, end)]
}

export function randomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  const rnd = Math.floor(Math.random() * (max - min)) + min
  return rnd
}

export function pickRandom(items) {
  const index = randomInt(0, items.length)
  const item = items[index]
  return item
}