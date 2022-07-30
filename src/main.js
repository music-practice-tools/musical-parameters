import logo from "./icons/pwa-512x512.png";
import { createParametersHeader } from "./parameters-header.js";
import { createParameterPicker } from "./parameter-picker.js";
import { createFileControls } from "./file-controls.js";
import parameters from "./parameters.json";

function render(element, { image }) {
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

function renderHeader(element, { setNames }) {
  while (element.childNodes.length) {
    element.removeChild(element.lastChild);
  }
  element.appendChild(createParametersHeader(setNames));
}

function renderFileControls(element, { dataWrapper }) {
  while (element.childNodes.length) {
    element.removeChild(element.lastChild);
  }
  element.appendChild(createFileControls(dataWrapper));
}

function renderParams(element, { setParams }) {
  while (element.childNodes.length > 1) {
    element.removeChild(element.lastChild);
  }
  setParams.params.forEach((param) => {
    element.appendChild(createParameterPicker(param));
  });
}

const app = document.querySelector("#app");
render(app, { image: logo });

const controls = app.querySelector("#controls");
const dataWrapper = [parameters];
renderFileControls(controls, { dataWrapper });

const card = app.querySelector("#card");

function onLoad() {
  const parameters = dataWrapper[0];
  const setNames = parameters.map((param) => param.set);
  renderHeader(card, { setNames });
  renderParams(card, { setParams: parameters[0] });
}
onLoad();

controls.addEventListener("dataload", (e) => {
  onLoad();
});
card.addEventListener("input", (e) => {
  const parameters = dataWrapper[0];
  renderParams(card, { setParams: parameters[e.target.value] });
});
