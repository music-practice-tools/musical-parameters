import { pickRandom } from "./random.js";

export function createParameterPicker(name, values) {
  const normalisedValues = values.map((value) => (Array.isArray(value) && value.length == 2) ? value : [value, value.replace(/ /g, "_")])

  const render = (element, { name, value, values }) => {
    let content = value
    if (values) {
      content = `<label><div class="select-wrapper">
      <select>${values.map(
        (val, i) => {
          val = !Array.isArray(val) ? [val, val] : val
          return `<option value="${i}" ${val[0]==value?'selected':''}>${val[0]}</option>`
        }
      )}</select></div></label>`;
    }

    element.innerHTML = `<div class="picker">
    <div class="picker-name">${name}:</div>
    <div class="picker-value">${content}</div>
    <button id="picker-btn" title="Pick new" aria-label="Pick new">\u{1F504}</button></div>`;
  };

  const element = document.createElement("div");

  const onClick = (value) => {
    if (!value) {
      value = pickRandom(normalisedValues);
    }
    render(element, { name, value: value[0], values });
    element.dispatchEvent(
      new CustomEvent("valueset", { bubbles: true, detail: { name, value } })
    );
  };

  element.addEventListener("input", (e) => {
    const select = e.target
    let value = values[select.value]
    if (!Array.isArray(value))
    {
      value = [value, value]
    }
    onClick(value)
  })

  element.addEventListener("click", (e) => {
    if (e.target.nodeName == "BUTTON")
    { 
      onClick();
    }
  });

  setTimeout( onClick, 0);

  return element;
}
