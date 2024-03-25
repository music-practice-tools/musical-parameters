import Scale from '@tonaljs/scale'

// invoked with this being values
const actions = {
  tonalCentre(params, scale, degree) {
    return Scale.degrees(this[scale] + ' major')(this[degree])
  },
  calcIndexFromTwo(params, values1, values2, width) {
    const index = (this[values1] - 1) * params[values2].length + this[values2]
    return (width ? index.toString().padStart(width, '0') : index)
  },
}

function interpolate(str, objValues, arrParams) {
  // Replace tokens of form ${name}
  return str.replace(/\${([^}]+)}/g, (_, prop) => {
    const matches = [...prop.matchAll(/([\w\s]+)[\(\,\)]/g)]
    if (matches.length) {
    // Is function call of form (param1, param2...)
    const captures = matches.map((a) => a[1]) // => capturing group contents ie param
      const actionName = captures.shift()
      const objParams = {}
      arrParams.forEach((elem) => {
        objParams[elem.name] = elem.values
      })
      // the params object followed by each function param
      const args = [objParams, ...captures]
      try {
        // vars become this for called action function
        const result = actions[actionName].apply(objValues, args)
        return result
      } catch {
        return ''
      }
    } else {
      return objValues[prop]
    }
  })
}

function play(media, pause=false) {
  const audio = app.querySelector('audio')
  const rate = audio.playbackRate // as is reset
  audio.src = media
  audio.load()
  audio.play().then(audio.playbackRate = rate).catch(() => { }) // user needs to interact for play
  if (pause) {
    audio.pause()
  }
}

export function mediaPlay(mediaTemplate, values, params) {
  const media = interpolate(mediaTemplate, values, params)
  const stopped = document.querySelector('#media-mode').value == "stopped"
  play(media, stopped)
}

export function noteUpdate(noteTemplate, values, params) {
  const content = interpolate(noteTemplate, values, params)
  const note = document.querySelector('#note')
  note.innerHTML = content
}
