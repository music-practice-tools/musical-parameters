import Scale from "@tonaljs/scale";

function interpolate(str, obj) {
  return str.replace(/\${([^}]+)}/g, (_, prop) => obj[prop])
}
  
function play(media) {
  const audio = app.querySelector("audio");
  audio.src=media
  audio.load()
  audio.play().catch(()=>{}) // user needs to interact for play
}
  
export function mediaPlay(mediaTemplate, values) {
      const media = interpolate(mediaTemplate, values)
      play(media)
    }


export function noteUpdate(noteTemplate, values) {
  const tonalCentre = Scale.degrees(values['Key'] + ' major')(values['Harmonic Environment']);
  const note = document.querySelector("#note");
  const content = interpolate(noteTemplate, values)
  note.innerHTML = content + ' ' + tonalCentre
}