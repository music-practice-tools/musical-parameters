export function createParametersHeader(hasNote, names) {
  function render(element, hasNote, { names }) {
    const select =  
    (names.length == 1) ? `<span id="set">${names[0]}</span>` :
      `<select id="set">${names.map(
        (name, i) => `<option value="${i}">${name}</option>`
      )}</select>`;
    element.innerHTML = `
    <div class="picker-header">
    <div class="picker-header-value">${select}</div>
    ${(hasNote) ? '<div id="note"><span>&nbsp;</span></div>' : ''}
    <button id="pick-all" title="Pick new values - N key" aria-label="Pick all">\u{1F504}</button></div>`;
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

  render(element, hasNote, { names });

  return element;
}
