export function createParametersHeader(names) {
  function render(element, { names }) {
    const select = `<label>Set: 
    <select id="set">${names.map(
      (name, i) => `<option value="${i}">${name}</option>`,
      names
    )}</select></label>`;
    element.innerHTML = `<div class="picker-header">
    <div>${select}</div>
    <button title="Pick all" aria-label="Pick all">\u{1F504}</button></div>`;
  }

  const element = document.createElement("div");
  const onClick = (_) => {
    const paramElements = document.querySelectorAll(".picker button");
    paramElements.forEach((element) => {
      element.click();
    });
  };

  element.addEventListener("click", (e) => {
    if (e.target.nodeName == "BUTTON") {
      onClick();
    }
  });

  render(element, { names });

  return element;
}
