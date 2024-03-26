import logo from './icons/pwa-512x512.png'
import { getYaml, parseAndDispatchYaml } from './process-yaml.js'
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
import { randomInt } from './random.js'

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
const nav = app.querySelector('nav')
const card = app.querySelector('#card')
const footer = app.querySelector('#footer')

// state`
const initialValues = Object.fromEntries(
  new URL(window.location.href).searchParams
)
let state = {
  title: "", // set on data load
  parameterCollection: [], // set on data load
  values: { ...initialValues }, // deep copy
  currentSetIndex: 0, // set on data load
  get currentSet() { return this.parameterCollection[this.currentSetIndex] },
  get setNames() { return this.parameterCollection.map((set) => set.set) },
  get pickerSetIndex() { return this.parameterCollection.findIndex((value) => value.isPicker) }
}

function doNext() {
  const pickAll = app.querySelector('#pick-all')
  if (pickAll) {
    pickAll.click()
  }
}

function pickSet() {
  const set = app.querySelector('#set')
  const newSetIndex = randomInt(0, set.options.length - 1)
  set.options[newSetIndex].selected = true;
  onSetChange(newSetIndex)
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
  app.querySelector('#title').innerText = state.title
  renderCollectionHeader(card, { set, setNames: state.setNames })
  renderFooter(footer, { set, filename: state.filename })
  onSetChange(state.currentSetIndex)
})

function onSetChange(index) {
  const values = state.values = { ...initialValues } // clear any set specific values
  state.currentSetIndex = index
  const set = state.currentSet
  renderControls(nav, { set, values })
    .then((p) => {
      renderCollectionRows(card, { set })
    })
}

// Set (or value) changed, 
app.addEventListener('change', (e) => {
  if (e.target.id == 'set') {
    onSetChange(e.target.value)
  }
})

// only called if play not looping
// on app as youtube player creation is async
app.addEventListener('ended', (e) => {
  doNext()
})


// value changed
card.addEventListener('valueset', (e) => {
  const { name, value } = e.detail
  const [display, data] = value
  state.values[name] = data ?? display
  debouncedUpdate(state.currentSet, state.values)
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
  } else if (e.code == 'KeyS') {
    pickSet()
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
    parseAndDispatchYaml(yaml, `URL: ${filename}`, nav)
  })
} else {
  let yaml = getYaml() ?? initialParameters
  parseAndDispatchYaml(yaml, 'Initial-Parameters.yaml', nav)
}
