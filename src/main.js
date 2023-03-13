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
const parsedUrl = new URL(window.location.href);
let state = { 
  values: Object.fromEntries(parsedUrl.searchParams),
  set: 0, 
  parameterCollection: [],
  get mediaTemplate() { return this.parameterCollection[this.set].mediaTemplate }
}

// Collection loaded
controls.addEventListener("dataload", (e) => {
  state.parameterCollection = e.detail;
  state.set = 0
  renderControls(controls, !!state.mediaTemplate);
  renderCollection(card, state.parameterCollection);
});

// Set changed
card.addEventListener("input", (e) => {
  state.set = e.target.value;
  renderControls(controls, !!state.mediaTemplate);
  renderCollectionRows(card, { setParams: state.parameterCollection[state.set] });
});

// value changed
card.addEventListener("valueset", (e) =>
{
  if (state.mediaTemplate){
    const { name, value } = e.detail;
    state.values[name] = value[1];
    safeMediaPlay(state.mediaTemplate, state.values);
}})

// Key
window.addEventListener('keyup', (e) => {
  const audio = app.querySelector("audio");
  if (e.code =="KeyP")
  {
    const pickAll = app.querySelector("#pick-all")
    if (pickAll) 
    { 
      pickAll.click()
    }
  }
  else if (!!audio && e.code == 'Space')
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
