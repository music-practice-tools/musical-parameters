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

const parsedUrl = new URL(window.location.href);
let values=Object.fromEntries(parsedUrl.searchParams) 
let parameterCollection = []
let mediaTemplate

// Collection loaded
controls.addEventListener("dataload", (e) => {
  parameterCollection = e.detail;
  mediaTemplate = parameterCollection[0].mediaTemplate
  renderControls(controls, !!mediaTemplate);
  renderCollection(card, parameterCollection);
});

// Set changed
card.addEventListener("input", (e) => {
  const setIndex = e.target.value;
  mediaTemplate = parameterCollection[setIndex].mediaTemplate
  renderControls(controls, !!mediaTemplate);
  renderCollectionRows(card, { setParams: parameterCollection[setIndex] });
});

// value changed
card.addEventListener("valueset", (e) =>
{
  if (mediaTemplate){
    const { name, value } = e.detail;
    values[name] = value[1];
    safeMediaPlay(mediaTemplate, values);
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
const fileURI = values.file
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
