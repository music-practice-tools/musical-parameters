import { pickRandom } from "./random.js";

export function createParameterPicker({ id, name, values }) {
  const render = (element, { id, name, value }) => {
    element.innerHTML = `<div data-id="${id}" class="picker"><div class="picker-name">${name}:</div><div class="picker-value">${value}</div><button>\u{1F504}</button></div>`;
  };
  const element = document.createElement("div");
  const onClick = (_) => {
    const value = pickRandom(values);
    render(element, { id, name, value });
  };
  element.addEventListener("click", onClick);
  onClick();
  return element;
}
