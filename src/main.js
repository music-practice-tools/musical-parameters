import logo from "./icons/pwa-512x512.png";
import { debounce } from "./debounce.js";
import { createParametersHeader } from "./parameters-header.js";
import { createParameterPicker } from "./parameter-picker.js";
import { createFileControls } from "./file-controls.js";
import initialParameters from "../docs/examples/Initial-Parameters.yaml";

// Global exception handler
window.addEventListener("error", (event) => {
  const error = event.error;
  alert(`${error.type}: ${error.message}\n`);
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

function renderFileControls(element) {
  while (element.childNodes.length) {
    element.removeChild(element.lastChild);
  }
  element.appendChild(createFileControls());
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
let parameterCollection = initialParameters;
let values = {}
let mediaTemplate

// Collection loaded
controls.addEventListener("dataload", (e) => {
  parameterCollection = e.detail;
  values = {}
  mediaTemplate = parameterCollection[0].mediaTemplate
  renderCollection(card, parameterCollection);
});

// Set changed
card.addEventListener("input", (e) => {
  const setIndex = e.target.value;
  mediaTemplate = parameterCollection[setIndex].mediaTemplate
  renderCollectionRows(card, { setParams: parameterCollection[setIndex] });
});

function interpolate(str, obj) {
  return str.replace(/\${([^}]+)}/g, (_, prop) => obj[prop])
}

const audio = new Audio();
  
function play(media) {
  audio.src=media
  audio.load()
  audio.play();
}

const safeMediaPlay = debounce(
  (values) => {
    const media = interpolate(mediaTemplate, values)
    play(media)
  },
  250
)

// value changed
card.addEventListener("valueset", (e) =>
{
  if (mediaTemplate){
    const { name, value } = e.detail;
    values[name] = value[1];
    safeMediaPlay(values);
}})

renderFileControls(controls);
controls.dispatchEvent(
  new CustomEvent("dataload", { detail: parameterCollection })
);
