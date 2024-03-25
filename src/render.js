import { createParametersHeader } from './parameters-header.js'
import { createParameterPicker } from './parameter-picker.js'
import { createControls } from './controls.js'
import { noteUpdate, mediaPlay } from './media.js'
import { youTubePlay } from './youtube.js'
import { debounce } from './debounce.js'


export function renderApp(element, { image }) {
  element.innerHTML = `    
      <header>
        <img src="${image}" title="Musical Parameters" class="logo" alt="logo" />
        <h1 id="title">Musical Parameters</h1>
      </header>
      <nav id="controls"></nav>
      <main class="card" id="card"></main>
      <footer class="footer" id="footer"></footer>
      `
}

// first value
function youTubeValue(values) {
  return Object.values(values).find((el) => el.toString().startsWith('v='))
}

function hasYouTube(set) {
  return set.mediaTemplate && set.mediaTemplate.toLowerCase() == 'youtube'
}

function hasMedia(set, values) {
  return (
    set.mediaTemplate &&
    !hasYouTube(set) &&
    (!set.mediaTemplate.includes('mediaRoot') ||
      values.hasOwnProperty('mediaRoot'))
  )
}

function hasNote(set) {
  return !!set.noteTemplate
}

export function renderControls(element, { set, values }) {
  while (element.childNodes.length) {
    element.removeChild(element.lastChild)
  }
  element.appendChild(createControls(hasMedia(set, values), hasYouTube(set)))
}

export function renderCollectionHeader(element, { set, setNames }) {
  while (element.childNodes.length) {
    element.removeChild(element.lastChild)
  }
  element.appendChild(createParametersHeader(setNames))
}

export function renderCollectionRows(element, { set }) {
  while (element.childNodes.length > 1) {
    element.removeChild(element.lastChild)
  }
  set.params.forEach((param) => {
    const { name, values } = param
    const vals = [...values]
    element.appendChild(createParameterPicker(name, vals))
  })
}

export function renderFooter(element, { filename }) {
  element.innerHTML = `<span>${filename}</span><a target="_blank"href="https://ko-fi.com/stevelee1084">Reward Steve</a>`
}

// Called for updates out of normal render flow 
// debounced as will be called multiple times
export const debouncedUpdate = debounce((set, values) => {
  if (hasNote(set)) {
    noteUpdate(set.noteTemplate, values, set.params)
  } else {
    noteUpdate('', null, null)
  }

  if (hasMedia(set, values)) {
    mediaPlay(set.mediaTemplate, values, set.params)
  } else {
    // first value with a video
    const ytVideo = youTubeValue(values)
    if (ytVideo) {
      youTubePlay(ytVideo)
    }
  }
}, 150)

