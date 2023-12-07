import Scale from '@tonaljs/scale'

// invoked with this set to values
const actions = {
  tonalCentre(scale, degree) {
    return Scale.degrees(this[scale] + ' major')(this[degree])
  },
}

function interpolate(str, obj) {
  return str.replace(/\${([^}]+)}/g, (_, prop) => {
    const matches = [...prop.matchAll(/([\w\s]+)[\(\,\)]/g)]
    if (matches.length) {
      const captures = matches.map((a) => a[1])
      const name = captures.shift()
      const args = captures
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

export function mediaPlay(mediaTemplate, values) {
  const media = interpolate(mediaTemplate, values)
  play(media)
}

export function noteUpdate(noteTemplate, values) {
  const content = interpolate(noteTemplate, values)
  const note = document.querySelector('#note')
  note.innerHTML = content
}
