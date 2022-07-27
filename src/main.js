import logo from "./icons/pwa-512x512.png";
import { createParametersHeader } from "./parameters-header.js";
import { createParameterPicker } from "./parameter-picker.js";
import parameters from "./parameters.json";

function render(element, { image }) {
  element.innerHTML = `
    <header>
      <a href="https://developer.mozilla.org/en-US/ndocs/Web/JavaScript" target="_blank">
        <img src="${image}" class="logo vanilla" alt="logo" />
      </a>
      <h1>Generate Musical Parameters</h1>
    </header>
    <main class="card" id="card"></main>
    `;
}

function renderHeader(element, { setNames }) {
  element.appendChild(createParametersHeader(setNames));
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

const card = app.querySelector("#card");
const setNames = parameters.map((param) => param.set);
renderHeader(card, { setNames });
renderParams(card, { setParams: parameters[0] });

card.addEventListener("input", (e) => {
  renderParams(card, { setParams: parameters[e.target.value] });
});
