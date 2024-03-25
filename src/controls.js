import { storeYaml, parseAndDispatchYaml } from './process-yaml.js'
import { youTubeLoad } from './youtube.js'

const opts = {
  startIn: 'desktop',
  suggestedName: 'Musical Parameters.yaml',
  types: [
    {
      description: 'YAML file',
      accept: { 'text/yaml': ['.yaml'] },
    },
  ],
}

const hasFileSystemAccessAPI = !!window.showOpenFilePicker

async function loadFile() {
  const [fileHandle] = await window.showOpenFilePicker(opts)
  const file = await fileHandle.getFile()
  const yaml = await file.text()
  return { yaml, filename: file.name }
}

export function createControls(hasMedia = false, hasYoutube = false) {
  function render(element) {
    element.className = 'controls'
    element.innerHTML = `
    <div><a href="/docs/">About</a>
    ${hasFileSystemAccessAPI
        ? `<button style="border:0;" id="load-file" title="Load from file" aria-label="Load file">Load</button>`
        : `<label id="load-label" aria-label="Load file" tabindex="0">Load
        <input id="load-file" type="file" accept="text/yaml,.yaml" class="visually-hidden" tabindex="-1" >
      </label>
      `
      }</div>
    ${(hasMedia && !hasYoutube)
        ? `<audio id="player" controls loop></audio>`
        : ''
      }
    ${(!hasMedia && hasYoutube)
        ? `<div id="ytcontrols">
          <button id="playButton" class="playButton" data-paused=""></button>
          <span id="videoTime">0:00 / 0:00</span>
          </div>`
        : ''
      }
    ${(hasMedia || hasYoutube)
        ? `<div>
          <select id="media-mode">
            <option value="loop" selected>Loop 1</option>
            <option value="shuffle" >Shuffle</option>
            <option value="stopped" >Stopped</option>
          </select>
          <select id="media-speed">
            <option value="1.5">1.5x&nbsp;</option>
            <option value="1.25">1.25x&nbsp;</option>
            <option value="1" selected>Normal&nbsp;</option>
            <option value="0.75">0.75x&nbsp;</option>
            <option value="0.5">0.5x&nbsp;</option>
            <option value="0.25">0.25x&nbsp;</option>
          </select>
          ${(hasYoutube)
          ? '<label>Show video: <input id="showVideo" type="checkbox"/></label>' : ''} 
              </div>
              <div id="ytVideo" class="hidden">`
        : ''
      }</div>`
  }

  const element = document.createElement('div')

  if (hasFileSystemAccessAPI) {
    element.addEventListener('click', (e) => {
      if (e.target.id == 'load-file') {
        loadFile()
          .catch((e) => {
            if (e.name == 'AbortError') {
              return Promise.resolve({})
            }
          })
          .then(({ yaml, filename }) => {
            if (yaml) {
              parseAndDispatchYaml(yaml, `File: ${filename}`, element)
              storeYaml(yaml)
            }
          })
      }
    })
  } else {
    element.addEventListener('change', (e) => {
      if (e.target.getAttribute('id') == 'load-file') {
        const [file] = e.target.files
        if (file) {
          const reader = new FileReader()
          reader.addEventListener(
            'load',
            (e) => {
              const yaml = reader.result
              parseAndDispatchYaml(yaml, `File: ${file.name}`, element)
              storeYaml(yaml)
            },
            false
          )

          reader.readAsText(file)
        }
      }
    })
    element.addEventListener('keyup', (e) => {
      if (e.code == 'Enter') {
        e.target.click()
        e.stopPropagation()
      }
    })
  }

  render(element)

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString()
    const secs = Math.floor(seconds % 60).toString()
    return `${mins.padStart(1, '0')}:${secs.padStart(2, '0')}`
  }

  function processAudio(audio, expanded) {
    const mediaMode = app.querySelector('#media-mode')
    mediaMode.addEventListener('change', (e) => {
      audio.loop = !!(mediaMode.value == 'loop')
      const method = mediaMode.value == "stopped" ? 'pause' : 'play'
      audio[method]()
    })

    audio.playbackRate = 1
    const mediaSpeed = app.querySelector('#media-speed')
    mediaSpeed.addEventListener('change', (e) => {
      audio.playbackRate = mediaSpeed.value
    })

    if (expanded) {
      const playButton = app.querySelector('#playButton')
      audio.setStateFunc(({ duration, time, isPlaying }) => {
        if (!isPlaying) {
          playButton.setAttribute('data-paused', '')
          playButton.setAttribute('aria-label', 'Play')
        } else {
          const videoTime = document.querySelector('#videoTime')
          videoTime.textContent = `${formatTime(time)} / ${formatTime(duration)}`
          playButton.removeAttribute('data-paused')
          playButton.setAttribute('aria-label', 'Pause')
        }
      })
      if (playButton) {
        playButton.addEventListener('click', (e) => {
          const isPlaying = (audio.getPlayerState() == 1)
          const method = (isPlaying) ? 'pause' : 'play'
          audio[method]()
        })
      }

      const showVideo = app.querySelector('#showVideo')
      if (showVideo) {
        showVideo.addEventListener('input', (e) => {
          if (e.target.checked) {
            audio.getIframe().classList.remove("hidden")
          } else {
            audio.getIframe().classList.add("hidden")
          }
        })
      }
    }
  }

  // TODO this is dodgy as rely on delay to alow adding to DOM
  if (!hasMedia && hasYoutube) {
    youTubeLoad().then(player => processAudio(player, true))
  } else if (hasMedia && !hasYoutube) {
    setTimeout(() => {
      const player = app.querySelector('#player')
      processAudio(player, false)
    }, 450)

  }

  return element
}
