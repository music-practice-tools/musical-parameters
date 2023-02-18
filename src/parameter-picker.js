import { pickRandom } from "./random.js";

export function createParameterPicker({ name, values }) {
  const normalisedValues = values.map((value) => (Array.isArray(value) && value.length == 2) ? value : [value, value.replace(/ /g, "_")])

  const render = (element, { name, value }) => {
    element.innerHTML = `<div class="picker">
    <div class="picker-name">${name}:</div>
    <div class="picker-value">${value}</div>
    <button title="Pick new" aria-label="Pick new">\u{1F504}</button></div>`;
  };

  const element = document.createElement("div");

  const onClick = (_) => {
    const value = pickRandom(normalisedValues);
    render(element, { name, value: value[0] });
    element.dispatchEvent(
      new CustomEvent("valueset", { bubbles: true, detail: { name, value } })
    );
  };

  element.addEventListener("click", (e) => {
    if (e.target.nodeName == "BUTTON")
    { 
      onClick();
    }
  });

  setTimeout( onClick, 0);

  return element;
}
