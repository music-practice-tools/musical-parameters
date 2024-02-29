import { storeYaml, parseAndDispatchYaml } from './process-yaml.js'

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

export function createControls(hasMedia = false) {
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
    ${hasMedia
        ? `<audio id="player" controls loop></audio>
        <div>
          <select id="media-mode">
            <option value="loop" selected>Loop 1</option>
            <option value="shuffle" >Shuffle</option>
            <option value="stopped" >Stopped</option>
          </select>
          <select id="media-speed">
            <option value="1.4">1.4x&nbsp;</option>
            <option value="1.2">1.2x&nbsp;</option>
            <option value="1" selected>Normal&nbsp;</option>
            <option value="0.85">0.85x&nbsp;</option>
            <option value="0.7">0.7x&nbsp;</option>
            <option value="0.65">0.65x&nbsp;</option>
            <option value="0.5">0.5x&nbsp;</option>
          </select>
        </div>`
        : ''
      }
    `
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
              storeYaml(yaml)
              parseAndDispatchYaml(yaml, `File: ${filename}`, element)
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
              storeYaml(yaml)
              parseAndDispatchYaml(yaml, `File: ${file.name}`, element)
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

  return element
}
