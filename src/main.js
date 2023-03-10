import logo from "./icons/pwa-512x512.png";
import { createParametersHeader } from "./parameters-header.js";
import { createParameterPicker } from "./parameter-picker.js";
import { createControls, parseAndDispatchYaml } from "./controls.js";
import initialParameters from "./Initial-Parameters.yaml?raw";
//import { safeMediaPlay } from "./media.js";
import { debounce } from "./debounce.js";

// Global exception handler
window.addEventListener("error", (event) => {
  const error = event.error;
  alert(`${error.type}: ${error.message}\n`);
  event.preventDefault();
});
window.addEventListener("unhandledrejection", (event) => {
  event.preventDefault();  // hmm doesn't work in Ffx
  throw(event.reason)
});

function renderTemplate(element, { image }) {
  element.innerHTML = `
  
    <header>
      <img src="${image}" class="logo" alt="logo" />
      <h1>Generate Musical Parameters</h1>
    </header>
    <nav id="controls"></nav>
    <main class="card" id="card"></main>
    `;
}

function renderControls(element, hasMedia) {
  while (element.childNodes.length) {
    element.removeChild(element.lastChild);
  }
  element.appendChild(createControls(hasMedia));
}

function renderCollectionHeader(element, { setNames }) {
  while (element.childNodes.length) {
    element.removeChild(element.lastChild);
  }
  element.appendChild(createParametersHeader(setNames));
}

function renderCollectionRows(element, { setParams }) {
  while (element.childNodes.length > 1) {
    element.removeChild(element.lastChild);
  }
  setParams.params.forEach((param) => {
    element.appendChild(createParameterPicker(param));
  });
}

function renderCollection(container, parameters) {
  const setNames = parameters.map((param) => param.set);
  renderCollectionHeader(container, { setNames });
  renderCollectionRows(container, { setParams: parameters[0] });
}

const app = document.querySelector("#app");
renderTemplate(app, { image: logo });
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
    safeMediaPlay(values);
}})

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


function interpolate(str, obj) {
    return str.replace(/\${([^}]+)}/g, (_, prop) => obj[prop])
  }
  
function play(media) {
  const audio = app.querySelector("audio");
  audio.src=media
  audio.load()
  audio.play().catch(()=>{}) // user needs to interact for play
}
  
const safeMediaPlay = debounce(
    (values) => {
      const media = interpolate(mediaTemplate, values)
      play(media)
    },
    250
  )
  

const fileURI = values.file
if (fileURI)
{
  fetch(fileURI)
  .then((response) => {
    if (!response.ok) {
      throw new ErrorEvent("File error", {
        message: `fetching parameters file:\n\n${fileURI}\n\ncode: ${response.status}`
      });
  
    } // fixme - throw error event and stop processing
    return response.text();
  })
  .then((yaml) => {
    parseAndDispatchYaml(yaml, fileURI, controls);
  })
}
else {
  parseAndDispatchYaml(initialParameters, 'Initial-Parameters.yaml', controls);
}
