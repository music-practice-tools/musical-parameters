import logo from "./icons/pwa-512x512.png";
import { parseAndDispatchYaml } from "./controls.js";
import { renderApp, renderControls, renderCollection, renderCollectionRows } from "./render.js"
import { safeMediaPlay } from "./media.js";
import { fetchParameters } from "./fetch-parameters.js";
import initialParameters from "./Initial-Parameters.yaml?raw";

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

// state 
const initialValues = Object.fromEntries((new URL(window.location.href)).searchParams)
let state = { 
  values: {...initialValues}, // deep copy
  set: 0,                     // set on data load
  parameterCollection: [],    // set on data load
  get mediaTemplate() { return this.parameterCollection[this.set].mediaTemplate },
  get _hasExtra() { return this.parameterCollection[this.set].params.some((e)=>!!e.extra) },
  _showExtra: initialValues.showExtra ?? 0, // 0, 1 or 2 as per select values
  get extra() { // quadstate: null, 0, 1 or 2 
    return this._hasExtra ? this._showExtra : null
  },
  set extra(ext) { if (ext !== null && this._hasExtra) { this._showExtra = ext }}
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
  state.parameterCollection = e.detail;
  state.set = 0
  renderControls(controls, showMedia(), state.extra);
  renderCollection(card, state.parameterCollection, state.extra);

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

controls.addEventListener("extra", (e) => {
    state.extra = e.detail.enabled
    renderCollectionRows(card, { setParams: state.parameterCollection[state.set] }, state.extra);
});

function showMedia(){ 
  return state.mediaTemplate && ( !state.mediaTemplate.includes("mediaRoot") || state.values.hasOwnProperty('mediaRoot'))
}

// Set or value changed
card.addEventListener("input", (e) => {
  if (e.target.id == "set") {
    state.values = {...initialValues} // clear any set specific values
    state.set = e.target.value;
    renderControls(controls, showMedia(), state.extra);
    renderCollectionRows(card, { setParams: state.parameterCollection[state.set] }, state.extra);
  }
});

// value changed
card.addEventListener("valueset", (e) =>
{
  if (showMedia()){
    const { name, value } = e.detail;
    state.values[name] = value[1] ?? value[0];
    safeMediaPlay(state.mediaTemplate, state.values);
}})

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
  else if (!!audio && e.code == 'KeyP' )
  {
    const method = audio.paused ? "play" : "pause"
    audio[method]()
  }
});

// initial parameters
const fileURI = state.values.file
if (fileURI)
{
  fetchParameters(fileURI)
  .then((yaml) => {
    parseAndDispatchYaml(yaml, fileURI, controls);
  })
}
else {
  parseAndDispatchYaml(initialParameters, 'Initial-Parameters.yaml', controls);
}
