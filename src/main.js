import logo from "./icons/pwa-512x512.png";
import { createParametersHeader } from "./parameters-header.js";
import { createParameterPicker } from "./parameter-picker.js";
import { createFileControls } from "./file-controls.js";
import initialParameters from "./parameters.json";

// Global exception handler
window.addEventListener("error", (event) => {
  const error = event.error;
  alert(`${error.type}: ${error.message}\n`);
});

function renderTemplate(element, { image }) {
  element.innerHTML = `
    <header>
      <a href="https://developer.mozilla.org/en-US/ndocs/Web/JavaScript" target="_blank">
        <img src="${image}" class="logo vanilla" alt="logo" />
      </a>
      <h1>Generate Musical Parameters</h1>
    </header>
    <div id="controls"></div>
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

const app = document.querySelector("#app");
renderTemplate(app, { image: logo });

const controls = app.querySelector("#controls");
renderFileControls(controls);

function renderCollection(container, parameters) {
  const setNames = parameters.map((param) => param.set);
  renderCollectionHeader(container, { setNames });
  renderCollectionRows(container, { setParams: parameters[0] });
}


const card = app.querySelector("#card");
let parameterCollection = initialParameters;

// Collection loaded
controls.addEventListener("dataload", (e) => {
  parameterCollection = e.detail;
  renderCollection(card, parameterCollection);
});

// Set changed
card.addEventListener("input", (e) => {
  const setIndex = e.target.value;
  renderCollectionRows(card, { setParams: parameterCollection[setIndex] });
});

renderCollection(card, parameterCollection);
