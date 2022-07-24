export function createParametersHeader() {
  const render = (element) => {
    element.innerHTML = `<div class="picker-header"><div></div><button>\u{1F504}</button></div>`;
  };
  const element = document.createElement("div");
  const onClick = (_) => {
    const paramElements = document.querySelectorAll("div[data-id]");
    paramElements.forEach((element) => {
      element.click();
    });
  };
  element.addEventListener("click", onClick);
  render(element);
  return element;
}
