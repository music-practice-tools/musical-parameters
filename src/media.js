import Scale from '@tonaljs/scale'

// invoked with this set to values
const actions = {
  tonalCentre(scale, degree) {
    return Scale.degrees(this[scale] + ' major')(this[degree])
  },
  calcIndexFromTwo(params, values1, values2, width) {
    const index = (this[values1] - 1) * params[values2].length + this[values2]
    return (width ? index.toString().padStart(width, '0') : index)
  },
}

function interpolate(str, obj, params) {
  return str.replace(/\${([^}]+)}/g, (_, prop) => {
    const matches = [...prop.matchAll(/([\w\s]+)[\(\,\)]/g)]
    if (matches.length) {
      const captures = matches.map((a) => a[1])
      const name = captures.shift()
      const objParams = {}
      params.forEach((elem) => {
        objParams[elem.name] = elem.values
      })
      const args = [objParams, ...captures]
      try {
        const result = actions[name].apply(obj, args)
        return result
      } catch {
        return ''
      }
    } else {
      return obj[prop]
    }
  })
}

function play(media) {
  const audio = app.querySelector('audio')
  audio.src = media
  audio.load()
  audio.play().catch(() => {}) // user needs to interact for play
}

export function mediaPlay(mediaTemplate, values, params) {
  const media = interpolate(mediaTemplate, values, params)
  play(media)
}

export function noteUpdate(noteTemplate, values, params) {
  const content = interpolate(noteTemplate, values, params)
  const note = document.querySelector('#note')
  note.innerHTML = content
}
