import { randomInt } from './random.js'

export function createParametersHeader(names) {
  function render(element, { names }) {
    const select =
      names.length == 1
        ? `<span id="set">${names[0]}</span>`
        : `<select id="set">${names.map(
          (name, i) => `<option value="${i}">${name}</option>`
        )}</select>
          `
    element.innerHTML = `
    <div class="picker-header">
    <div class="picker-header-value">${select}</div>
    ${(names.length > 1) ? `<button id="pick-set" title="Pick set - S key" aria-label="Pick set">\u{1F504}</button>` : '' }
    <div id="note"><span>&nbsp;</span></div>
    <button id="pick-all" title="Pick new values - N key" aria-label="Pick all">\u{1F504}</button></div>`
  }

  const element = document.createElement('div')

  const clickAll = (_) => {
    const paramElements = document.querySelectorAll('.picker .picker-btn')
    paramElements.forEach((element) => {
      element.click()
    })
  }

  function pickSet() {
    const set = app.querySelector('#set')
    const newSetIndex = randomInt(0, set.options.length)
    set.options[newSetIndex].selected = true;
    set.dispatchEvent(new Event('change', { bubbles: true }))
  }

  element.addEventListener('click', (e) => {
    if (e.target.id == 'pick-all') {
      clickAll()
    }
    else if (e.target.id == 'pick-set') {
      pickSet()
    }
  })

  render(element, { names })

  return element
}
