import logo from './icons/pwa-512x512.png'
import { parseAndDispatchYaml } from './controls.js'
import {
  renderApp,
  renderControls,
  renderCollectionHeader,
  renderCollectionRows,
  renderFooter,
  debouncedUpdate
} from './render.js'
import { fetchParameters } from './fetch-parameters.js'
import initialParameters from './Initial-Parameters.yaml?raw'

// Global exception handlers
window.addEventListener('error', (event) => {
  const error = event.error
  alert(`${error.type}: ${error.message}\n`)
  event.preventDefault()
})
window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault() // hmm doesn't work in Ffx
  throw event.reason
})

// render
const app = document.querySelector('#app')
renderApp(app, { image: logo })
const controls = app.querySelector('#controls')
const card = app.querySelector('#card')
const footer = app.querySelector('#footer')

// state`
const initialValues = Object.fromEntries(
  new URL(window.location.href).searchParams
)
let state = {
  parameterCollection: [], // set on data load
  values: { ...initialValues }, // deep copy
  currentSetIndex: 0, // set on data load
  get currentSet() { return this.parameterCollection[this.currentSetIndex] },
  get setNames() { return this.parameterCollection.map((set) => set.set) }
}

function doNext() {
  const pickAll = app.querySelector('#pick-all')
  if (pickAll) {
    pickAll.click()
  }
}

function toggleAudio(audio) {
  const stopped = document.querySelector('#media-mode').value == "stopped"
  const method = audio.paused && !stopped ? 'play' : 'pause'
  audio[method]()
}

// Collection loaded
controls.addEventListener('dataload', (e) => {
  Object.assign(state, e.detail)
  state.currentSetIndex = 0
  const set = state.currentSet
  renderControls(controls, { set, values: state.values })
  renderCollectionHeader(card, { set, setNames: state.setNames })
  renderCollectionRows(card, { set })
  renderFooter(footer, { set, filename: state.filename })

  onSetChange(0)
})

function onSetChange(index) {
  const values = state.values = { ...initialValues } // clear any set specific values
  state.currentSetIndex = index
  const set = state.currentSet
  renderControls(controls, { set, values })
  renderCollectionRows(card, { set })
  debouncedUpdate(set, values)

  const audio = app.querySelector('#player')
  if (audio) {
    // only called if no loop attribute
    audio.addEventListener('ended', (e) => {
      doNext()
    })

    const mediaMode = app.querySelector('#media-mode')
    mediaMode.addEventListener('input', (e) => {
      audio.loop = !!(mediaMode.value == 'loop')
      const method = mediaMode.value == "stopped" ? 'pause' : 'play'
      audio[method]()
    })

    const mediaSpeed = app.querySelector('#media-speed')
    mediaSpeed.addEventListener('change', (e) => {
      audio.playbackRate = mediaSpeed.value
    })
  }
}

// Set (or value) changed, 
app.addEventListener('change', (e) => {
  if (e.target.id == 'set') {
    onSetChange(e.target.value)
  }
})

// value changed
card.addEventListener('valueset', (e) => {
  const { name, value } = e.detail
  state.values[name] = value[1] ?? value[0]
  if (name == 'Activity') {
    const set = app.querySelector('#set')
    const newIndex = value[1]
    set.options[newIndex].selected = true;
    onSetChange(newIndex)
  }
  const set = state.currentSet
  debouncedUpdate(set, state.values)
})

// touch to background
window.addEventListener('touchend', (e) => {
  const audio = app.querySelector('audio')
  if (e.target.id == 'app' && !!audio) {
    e.preventDefault()
    e.stopPropagation()
    toggleAudio(audio)
  }
})

// Key
window.addEventListener('keyup', (e) => {
  const audio = app.querySelector('audio')
  if (e.code == 'KeyN') {
    doNext()
  } else if (!!audio && (e.code == 'KeyP' || e.code == 'Space')) {
    toggleAudio(audio)
    e.stopPropagation()
    e.preventDefault()
  } else if (e.code.startsWith('Digit')) {
    // 0 - 9
    const digit = e.code.slice(-1)
    const n = digit == '0' ? 9 : digit - 1 // 1 based
    const pickers = app.querySelectorAll('#picker-btn')
    const picker = pickers[n]
    if (picker) {
      picker.click()
    }
    e.stopPropagation()
    e.preventDefault() // shouldn't be one
  }
})

// initial parameters
const fileURI = state.values.file
if (fileURI) {
  fetchParameters(fileURI).then((yaml) => {
    const filename = new URL(fileURI, 'https://example.com').pathname
      .split('/')
      .pop()
    parseAndDispatchYaml(yaml, `URL: ${filename}`, controls)
  })
} else {
  parseAndDispatchYaml(initialParameters, 'Initial-Parameters.yaml', controls)
}
