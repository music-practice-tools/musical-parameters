import { parse, stringify } from "yaml";

const opts = {
  startIn: "desktop",
  suggestedName: "Musical Parameters.yaml",
  types: [
    {
      description: "YAML file",
      accept: { "text/yaml": [".yaml"] },
    },
  ],
};

async function saveFile(yaml) {
  const newHandle = await window.showSaveFilePicker(opts);
  const writableStream = await newHandle.createWritable();
  await writableStream.write(yaml);
  await writableStream.close();
}

async function loadFile() {
  let fileHandle;
  [fileHandle] = await window.showOpenFilePicker(opts);
  const file = await fileHandle.getFile();
  const yaml = await file.text();
  return yaml;
}

export function createFileControls(dataWrapper) {
  function render(element) {
    element.className = "files";
    element.innerHTML = window.showSaveFilePicker
      ? `
    <span>Your files: </span><button id="save" title="Save to file" aria-label="Save to file">\u2913</button>
    <button id="load" title="Load from file" aria-label="Load file">\u2912</button>`
      : "(Saving and loading files is possible using Chrome, Edge or Opera)";
  }

  const dataLoad = new CustomEvent("dataload", { bubbles: true });
  const dataSave = new CustomEvent("datasave", { bubbles: true });

  const element = document.createElement("div");
  element.addEventListener("click", (e) => {
    if (e.target.getAttribute("id") == "save") {
      const yaml = stringify(dataWrapper[0]);
      saveFile(yaml).then(() => {
        element.dispatchEvent(dataSave);
      });
    } else if (e.target.getAttribute("id") == "load") {
      loadFile().then((yaml) => {
        try {
          const data = parse(yaml);
          dataWrapper[0] = data;
          element.dispatchEvent(dataLoad);
        } catch (e) {
          alert(`An error occured reading the file:\n\n${e.message}\n\nYou might like to use a tool like https://jsonformatter.org/yaml-validator`)
        }
      });
    }
  });

  render(element);

  return element;
}
