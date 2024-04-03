import { createPickerMenu } from './parameter-picker-menu.js'
import { pickRandom, everyRandomItemPicker } from './random.js'

export function createParameterPicker(name, values) {
  const normalisedValues = values.map((value) =>
    Array.isArray(value) && value.length == 2
      ? value
      : [value, value.toString().replace(/ /g, '_')]
  )

  let menuExpanded = false

  const render = (element, { name, value, values, menuExpanded }) => {
    let content = value
    if (values) {
      content = `<select title="Select value">${values.map((val, i) => {
        val = !Array.isArray(val) ? [val, val] : val
        return `<option value="${i}" ${val[0] == value ? 'selected' : ''}>${val[0]
          }</option>`
      })}</select>`
    }

    element.innerHTML = `<div class="picker">
    <div class="picker-name">${name}:</div>
    <div class="picker-value">${content}</div>
    <div class="picker-btns">
      <button class="picker-btn" title="Pick value" aria-label="Pick value">\u{1F504}</button>
      <button class="picker-menu-btn" title="Picker options" aria-label="Picker options" aria-haspopup="dialog" aria-control="picker-menu" 
      aria-expanded=${menuExpanded ? 'true' : 'false'}>&nbsp;&#8942;&nbsp;</button>
    </div></div>`
  }

  const element = document.createElement('div')

  let itemPicker
  const onClick = (thisPicker, value) => {
    if (!value) {
      if (!state.locked || thisPicker) {
        if (state.every) {
          if (!itemPicker) {
            itemPicker = everyRandomItemPicker(normalisedValues)
          }
          value = itemPicker.value
          itemPicker.getNextItem()
        } else {
          itemPicker = undefined
          value = pickRandom(normalisedValues)
        }
      }
    }
    if (value) {
      render(element, { name, value: value[0], values, menuExpanded })
      element.dispatchEvent(
        new CustomEvent('valueset', { bubbles: true, detail: { name, value } })
      )
    }
  }

  const { state, showPickerMenu } = createPickerMenu()
  const onMenuClick = (target) => {
    showPickerMenu(target)
  }

  element.addEventListener('input', (e) => {
    const select = e.target
    let value = values[select.value]
    if (!Array.isArray(value)) {
      value = [value, value]
    }
    menuExpanded = false
    onClick(true, value)
  })

  element.addEventListener('click', (e) => {
    if (e.target.nodeName == 'BUTTON') {
      if (e.target.className == 'picker-btn') {
        onClick(e.isTrusted)
      } else if (e.target.className == 'picker-menu-btn') {
        onMenuClick(e.target)
      }
    }
  })

  setTimeout(() => {
    onClick(true)
  }, 0)

  return element
}
