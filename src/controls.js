import { parse, stringify } from 'yaml'

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

export function parseAndDispatchYaml(yaml, filename, element) {
  try {
    const parameterCollection = parse(yaml)
    element.dispatchEvent(
      new CustomEvent('dataload', {
        bubbles: true,
        detail: { parameterCollection, filename },
      })
    )
  } catch (e) {
    throw new ErrorEvent('Parameter file error', {
      message: `An error occurred reading '${filename}':\n\n${e.message}\n\nYou might like to use a tool like https://jsonformatter.org/yaml-validator`,
    })
  }
}

export function createControls(hasMedia = false) {
  function render(element) {
    element.className = 'controls'
    element.innerHTML = `
    <div><a href="/docs/">About</a>
    ${
      hasFileSystemAccessAPI
        ? `<button style="border:0;" id="load-file" title="Load from file" aria-label="Load file">Load</button>`
        : `<label id="load-label" aria-label="Load file" tabindex="0">Load
        <input id="load-file" type="file" accept="text/yaml,.yaml" class="visually-hidden" tabindex="-1" >
      </label>
      `
    }</div>
    ${
      hasMedia
        ? `<audio id="player" controls loop></audio>
          <label title="Pick new values after playing"><input type="checkbox" id="autonext" />Jukebox</label>`
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
              parseAndDispatchYaml(reader.result, `File: ${file.name}`, element)
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
