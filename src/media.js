import { debounce } from "./debounce.js";

function interpolate(str, obj) {
    return str.replace(/\${([^}]+)}/g, (_, prop) => obj[prop])
  }
  
function play(media) {
const audio = app.querySelector("audio");
audio.src=media
audio.load()
audio.play().catch(()=>{}) // user needs to interact for play
}
  
export const safeMediaPlay = debounce(
    (mediaTemplate, values) => {
      const media = interpolate(mediaTemplate, values)
      play(media)
    },
    250
  )
  
