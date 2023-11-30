import logo from "./icons/pwa-512x512.png";
import { parseAndDispatchYaml } from "./controls.js";
import { renderApp, renderControls, renderCollection, renderCollectionRows } from "./render.js"
import { noteUpdate, mediaPlay } from "./media.js";
import { fetchParameters } from "./fetch-parameters.js";
import initialParameters from "./Initial-Parameters.yaml?raw";
import { debounce } from "./debounce.js";


// Global exception handlers
window.addEventListener("error", (event) => {
  const error = event.error;
  alert(`${error.type}: ${error.message}\n`);
  event.preventDefault();
});
window.addEventListener("unhandledrejection", (event) => {
  event.preventDefault();  // hmm doesn't work in Ffx
  throw(event.reason)
});

// render
const app = document.querySelector("#app");
renderApp(app, { image: logo });
const controls = app.querySelector("#controls");
const card = app.querySelector("#card");

// state 
const initialValues = Object.fromEntries((new URL(window.location.href)).searchParams)
let state = { 
  values: {...initialValues}, // deep copy
  set: 0,                     // set on data load
  parameterCollection: [],    // set on data load
  get mediaTemplate() { return this.parameterCollection[this.set].mediaTemplate },
  get noteTemplate() { return this.parameterCollection[this.set].noteTemplate },
  }

function doNext() {
  const pickAll = app.querySelector("#pick-all")
  if (pickAll) 
  { 
    pickAll.click()
  }
}

function hasMedia(){ 
  return state.mediaTemplate && ( !state.mediaTemplate.includes("mediaRoot") || state.values.hasOwnProperty('mediaRoot'))
}

function hasNote(){ 
  return !!state.noteTemplate
}
    
// Collection loaded
controls.addEventListener("dataload", (e) => {
  state.parameterCollection = e.detail;
  state.set = 0
  renderControls(controls, hasMedia());
  renderCollection(card, hasNote(), state.parameterCollection);

  const audio = app.querySelector("#player");
  if (audio) {
    // only called if no loop
    audio.addEventListener("ended", (e) => { doNext() })

    const autoNext = app.querySelector("#autonext");
      autoNext.addEventListener("change", (e) =>
        { 
          audio.loop = !autoNext.checked
        })
    }
  });

// Set or value changed
card.addEventListener("input", (e) => {
  if (e.target.id == "set") {
    state.values = {...initialValues} // clear any set specific values
    state.set = e.target.value;
    renderControls(controls, hasMedia());
    renderCollection(card, hasNote(), { setParams: state.parameterCollection[state.set] });
  }
});

const debouncedUpdate = debounce(
  (state) => {
    if (hasMedia()){
      mediaPlay(state.mediaTemplate, state.values);
    }
    if (hasNote()){
      noteUpdate(state.noteTemplate, state.values);
    }
  },
  200
)

// value changed
card.addEventListener("valueset", (e) =>
{
  if (hasMedia() || hasNote()) {
    const { name, value } = e.detail;
    state.values[name] = value[1] ?? value[0];
  }
  debouncedUpdate(state)
})

// touch to background 
window.addEventListener('touchend', (e) => {
  const audio = app.querySelector("audio");
  if (e.target.id == 'app' && !!audio )
  {
    e.preventDefault();
    const method = audio.paused ? "play" : "pause"
    audio[method]()  
  }
});

// Key
window.addEventListener('keyup', (e) => {
  const audio = app.querySelector("audio");
  if (e.code =="KeyN")
  {
    doNext()
  }
  else if (!!audio && (e.code == 'KeyP' || e.code =="Space"))
  {
    const method = audio.paused ? "play" : "pause"
    audio[method]()
  }
  else if (e.code.startsWith('Digit')) {  // 0 - 9
    const digit = e.code.slice(-1)
    const n = digit == '0' ? 9 : digit - 1 // 1 based
    const pickers = app.querySelectorAll("#picker-btn");
    const picker = pickers[n]
    if (picker) {
      picker.click()
    }
  }

});

// initial parameters
const fileURI = state.values.file
if (fileURI)
{
  fetchParameters(fileURI)
  .then((yaml) => {
    parseAndDispatchYaml(yaml, fileURI, controls);
  })
}
else {
  parseAndDispatchYaml(initialParameters, 'Initial-Parameters.yaml', controls);
}
