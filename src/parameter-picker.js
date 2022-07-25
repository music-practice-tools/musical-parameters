import { pickRandom } from "./random.js";

export function createParameterPicker({ name, values }) {
  const render = (element, { name, value }) => {
    element.innerHTML = `<div class="picker"><div class="picker-name">${name}:</div><div class="picker-value">${value}</div><button>\u{1F504}</button></div>`;
  };
  const element = document.createElement("div");
  const onClick = (_) => {
    const value = pickRandom(values);
    render(element, { name, value });
  };
  element.addEventListener("click", onClick);
  onClick();
  return element;
}
