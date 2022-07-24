import logo from "./icons/pwa-512x512.png";
import { createParametersHeader } from "./parameters-header.js";
import { createParameterPicker } from "./parameter-picker.js";
import parameters from "./parameters.json";

const app = document.querySelector("#app");
app.innerHTML = `
    <header>
      <a href="https://developer.mozilla.org/en-US/ndocs/Web/JavaScript" target="_blank">
        <img src="${logo}" class="logo vanilla" alt="logo" />
      </a>
      <h1>Generate Musical Parameters</h1>
    </header>
    <main class="card" id="card">
      
    </main>
`;

const card = app.querySelector("#card");
card.appendChild(
  createParametersHeader({ id: "all", name: "All Properties", values: [""] })
);
const pickerElements = parameters.map((param) => createParameterPicker(param));
pickerElements.forEach((el) => {
  card.appendChild(el);
});
