import { createParametersHeader } from "./parameters-header.js";
import { createParameterPicker } from "./parameter-picker.js";
import { createControls } from "./controls.js";

export function renderApp(element, { image }) {
    element.innerHTML = `    
      <header>
        <img src="${image}" class="logo" alt="logo" />
        <h1>Musical Parameters</h1>
      </header>
      <nav id="controls"></nav>
      <main class="card" id="card"></main>
      `;
}
  
export function renderControls(element, hasMedia) {
    while (element.childNodes.length) {
      element.removeChild(element.lastChild);
    }
    element.appendChild(createControls(hasMedia));
}
  
export function renderCollectionHeader(element, { setNames }) {
    while (element.childNodes.length) {
        element.removeChild(element.lastChild);
    }
    element.appendChild(createParametersHeader(setNames));
}
  
export function renderCollectionRows(element, { setParams }) {
    while (element.childNodes.length > 1) {
      element.removeChild(element.lastChild);
    }
    setParams.params.forEach((param) => {
      element.appendChild(createParameterPicker(param));
    });
}
  
export function renderCollection(container, parameters) {
    const setNames = parameters.map((param) => param.set);
    renderCollectionHeader(container, { setNames });
    renderCollectionRows(container, { setParams: parameters[0] });
}
