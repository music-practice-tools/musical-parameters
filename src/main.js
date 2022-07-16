import './style.css'
import logo from './pwa-512x512.png'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${logo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Generate Musical Parameters</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
  </div>
`

setupCounter(document.querySelector('#counter'))
