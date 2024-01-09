let menu = undefined,
  menuContent = undefined
let i = 1

export function createPickerMenu() {
  if (!document.querySelector('#picker-menu')) {
    menu = document.createElement('div')
    document.body.appendChild(menu) // outerHTML requires a parent node
    menu.outerHTML = `
    <div id="picker-menu" role="dialog" aria-menu="true" aria-labelledby="menu-title">
      <div id="menu-content">
        <h3 id="menu-title">Picker Options</h3>
        <div>
          <label title="Pick from all values">
            <input type="radio" id="picker-opt-any" name="picker-opt-mode" value="any" checked />
            Any</label>
          <label title="Pick every value">
            <input type="radio" id="picker-opt-every" name="picker-opt-mode" value="every" />
            Every</label>
        </div>
        <label title="Locked when pick all">
          <input type="checkbox" id="picker-opt-locked" />
          Locked</label>
        <button id="menu-close" title="Close menu" aria-label="Close menu">X</button>
      </div>
    </div>`
  }
  menu = document.querySelector('#picker-menu') // as menu still points to old div node
  menuContent = menu.querySelector('#menu-content')

  const state = {
    every: false,
    locked: false,
    handleEvent(e) {
      onMenuKey(e, this)
    }, // here so can remove it, slightly obscure
  }

  function showPickerMenu(button) {
    trigger = button

    function onClose(e) {
      if (e.target.id == 'picker-menu' || e.target.id == 'menu-close') {
        closeMenu(state)
        menu.removeEventListener('click', onClose)
      }
    }
    menuContent.querySelector('#picker-opt-any').checked = !state.every
    menuContent.querySelector('#picker-opt-every').checked = state.every
    menuContent.querySelector('#picker-opt-locked').checked = state.locked
    menu.addEventListener('click', onClose)
    const rectButton = button.getBoundingClientRect()
    const top = Math.floor(rectButton.bottom)
    const left = Math.floor(rectButton.left)
    menuContent.style.top = `${top}px`
    menuContent.style.left = `${left}px`
    button.setAttribute('aria-expanded', 'true')
    menu.style.display = 'block'

    // move up if needed
    const rectMenu = menuContent.getBoundingClientRect()
    const fits = rectMenu.bottom < document.body.getBoundingClientRect().bottom
    if (!fits) {
      const newTop = Math.floor(
        rectButton.top - (rectMenu.bottom - rectMenu.top)
      )
      menuContent.style.top = `${newTop}px`
    }

    // Find the first and last focusable elements inside the menu
    var focusableElements = menuContent.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    firstFocusableElement = focusableElements[0]
    lastFocusableElement = focusableElements[focusableElements.length - 1]
    firstFocusableElement.focus()
    menuContent.tabIndex = -1 // Required to stop focus going to body when menu clicked

    menuContent.addEventListener('keydown', state) // Use object so can remove later
  }
  return { state, showPickerMenu }
}

let firstFocusableElement, lastFocusableElement
let trigger = undefined

function closeMenu(state) {
  menuContent.removeEventListener('keydown', state)

  menu.style.display = 'none'
  trigger.setAttribute('aria-expanded', 'false')
  trigger.focus()

  state.every = menuContent.querySelector('#picker-opt-every').checked
  state.locked = menuContent.querySelector('#picker-opt-locked').checked
}

function onMenuKey(event, state) {
  if (event.keyCode === 9) {
    // TAB
    if (event.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        event.preventDefault()
        lastFocusableElement.focus()
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        event.preventDefault()
        firstFocusableElement.focus()
      }
    }
  }

  if (event.keyCode === 27) {
    // ESC
    closeMenu(state)
  }
}
