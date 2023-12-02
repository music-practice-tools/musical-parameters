import logo from "./icons/pwa-512x512.png";
import { parseAndDispatchYaml } from "./controls.js";
import { renderApp, renderControls, renderCollection, renderCollectionRows, renderFooter } from "./render.js"
import { noteUpdate, mediaPlay } from "./media.js";
import { fetchParameters } from "./fetch-parameters.js";
import initialParameters from "./Initial-Parameters.yaml?raw";
import { debounce } from "./debounce.js";


// Global exception handlers
window.addEventListener("error", (event) => {
  const error = event.error;
  alert(`${error.type}: ${error.message}\n`);
  event.preventDefault();
});
window.addEventListener("unhandledrejection", (event) => {
  event.preventDefault();  // hmm doesn't work in Ffx
  throw(event.reason)
});

// render
const app = document.querySelector("#app");
renderApp(app, { image: logo });
const controls = app.querySelector("#controls");
const card = app.querySelector("#card");
const footer = app.querySelector("#footer");

// state 
const initialValues = Object.fromEntries((new URL(window.location.href)).searchParams)
let state = { 
  values: {...initialValues}, // deep copy
  set: 0,                     // set on data load
  parameterCollection: [],    // set on data load
  get mediaTemplate() { return this.parameterCollection[this.set].mediaTemplate },
  get noteTemplate() { return this.parameterCollection[this.set].noteTemplate },
  hasMedia() { return this.mediaTemplate && ( !this.mediaTemplate.includes("mediaRoot") || this.values.hasOwnProperty('mediaRoot')) },
  hasNote() { return !!this.noteTemplate }
  }

function doNext() {
  const pickAll = app.querySelector("#pick-all")
  if (pickAll) 
  { 
    pickAll.click()
  }
}

// Collection loaded
controls.addEventListener("dataload", (e) => {
  Object.assign(state, e.detail)
  state.set = 0
  renderControls(controls, state.hasMedia());
  renderCollection(card, state.hasNote(), state.parameterCollection);
  renderFooter(footer, state.filename)

  const audio = app.querySelector("#player");
  if (audio) {
    // only called if no loop
    audio.addEventListener("ended", (e) => { doNext() })

    const autoNext = app.querySelector("#autonext");
      autoNext.addEventListener("change", (e) =>
        { 
          audio.loop = !autoNext.checked
        })
    }
  });

// Set or value changed
card.addEventListener("input", (e) => {
  if (e.target.id == "set") {
    state.values = {...initialValues} // clear any set specific values
    state.set = e.target.value;
    renderControls(controls, state.hasMedia());
    renderCollection(card, state.hasNote(), { setParams: state.parameterCollection[state.set] });
  }
});

const debouncedUpdate = debounce(
  (state) => {
    if (state.hasMedia()){
      mediaPlay(state.mediaTemplate, state.values);
    }
    if (state.hasNote()){
      noteUpdate(state.noteTemplate, state.values);
    }
  },
  200
)

// value changed
card.addEventListener("valueset", (e) =>
{
  if (state.hasMedia() || state.hasNote()) {
    const { name, value } = e.detail;
    state.values[name] = value[1] ?? value[0];
  }
  debouncedUpdate(state)
})

// touch to background 
window.addEventListener('touchend', (e) => {
  const audio = app.querySelector("audio");
  if (e.target.id == 'app' && !!audio )
  {
    e.preventDefault();
    const method = audio.paused ? "play" : "pause"
    audio[method]()  
  }
});

// Key
window.addEventListener('keyup', (e) => {
  const audio = app.querySelector("audio");
  if (e.code =="KeyN")
  {
    doNext()
  }
  else if (!!audio && (e.code == 'KeyP' || e.code =="Space"))
  {
    const method = audio.paused ? "play" : "pause"
    audio[method]()
    e.stopPropagation()
  }
  else if (e.code.startsWith('Digit')) {  // 0 - 9
    const digit = e.code.slice(-1)
    const n = digit == '0' ? 9 : digit - 1 // 1 based
    const pickers = app.querySelectorAll("#picker-btn");
    const picker = pickers[n]
    if (picker) {
      picker.click()
    }
    e.stopPropagation()
  }
});

// initial parameters
const fileURI = state.values.file
if (fileURI)
{
  fetchParameters(fileURI)
  .then((yaml) => {
    const filename = (new URL(fileURI)).pathname.split('/').pop()
    parseAndDispatchYaml(yaml, `URL: ${filename}`, controls);
  })
}
else {
  parseAndDispatchYaml(initialParameters, 'Initial-Parameters.yaml', controls);
}
