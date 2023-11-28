import { createParametersHeader } from "./parameters-header.js";
import { createParameterNote, createParameterPicker } from "./parameter-picker.js";
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
  
export function renderControls(element, hasMedia, extra) {
    while (element.childNodes.length) {
      element.removeChild(element.lastChild);
    }
    element.appendChild(createControls(hasMedia, extra));
}
  
export function renderCollectionHeader(element, { setNames }) {
    while (element.childNodes.length) {
        element.removeChild(element.lastChild);
    }
    element.appendChild(createParametersHeader(setNames));
}
  
export function renderCollectionRows(element, hasNote, { setParams }, showExtra) {
    while (element.childNodes.length > 1) {
      element.removeChild(element.lastChild);
    }
    if (hasNote) {
      element.appendChild(createParameterNote());
    }
    setParams.params.forEach((param) => {
      const {name, values, extra} = param 
      const vals = (showExtra  == 1 && extra) ? [...values, ...extra] : (showExtra == 2 && extra) ? [...extra] : [...values];
      element.appendChild(createParameterPicker(name, vals));
    });
}
  
export function renderCollection(container, hasNote, parameters, extra) {
    const setNames = parameters.map((param) => param.set);
    renderCollectionHeader(container, { setNames });
    renderCollectionRows(container, hasNote, { setParams: parameters[0]}, extra );
}
