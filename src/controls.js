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

const hasFileSystemAccessAPI = !!window.showOpenFilePicker;

async function loadFile() {
  const [fileHandle] = await window.showOpenFilePicker(opts);
  const file = await fileHandle.getFile();
  const yaml = await file.text();
  return { yaml, filename: file.name };
}

export function parseAndDispatchYaml(yaml, filename, element) {
  try {
    const paramsCollection = parse(yaml);
    element.dispatchEvent(
      new CustomEvent("dataload", { bubbles: true, detail: paramsCollection })
    );
  } catch (e) {
    throw new ErrorEvent("Parameter file error", {
      message: `An error occurred reading the file '${filename}':\n\n${e.message}\n\nYou might like to use a tool like https://jsonformatter.org/yaml-validator`
    });
  }
}

const iconStyle = `style="width:24px; height:24px"`;
const downloadIcon = `<svg  ${iconStyle} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
</svg>`;
const uploadIcon = `<svg ${iconStyle} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
</svg>`;

export function createControls(hasMedia=false, extra=null) {
  function render(element) {
    element.className = "controls";
    element.innerHTML = `
    <div><a href="/docs/">About ${downloadIcon}</a>
    <span>Load file:</span> 
    ${
      hasFileSystemAccessAPI
        ? `<button style="border:0;" id="load-file" title="Load from file" aria-label="Load file">${uploadIcon}</button>`
        : `<label id="load-button" aria-label="Load file">${uploadIcon} 
        <input id="load-file" type="file" accept="text/yaml,.yaml" class="visually-hidden">
      </label>
      `
    }</div>
    ${(extra !== null) ? `<label>Values: <select id="extra">
          <option ${(extra==0) ? 'selected' : ''} value="0">Values</option>
          <option ${(extra==1) ? 'selected' : ''} + value="1">Both</option>
          <option ${(extra==2) ? 'selected' : ''} + value="2">Extra</option>
          </select></label>` : ''}
    ${(hasMedia) ? '<audio id="player" controls loop></audio><label title="Pick next values at end of play"><input type="checkbox" id="autonext" />Pick next at end</label>' : ''}
    `;
  }

  const element = document.createElement("div");

  if (hasFileSystemAccessAPI) {
    element.addEventListener("click", (e) => {
      // get pointer event form svg path element
      if (e.target.parentNode.getAttribute("id") == "load-file") {
        loadFile().catch((e) => {
          if (e.name == 'AbortError') {
            return Promise.resolve({});
          }
        })
        .then(({ yaml, filename }) => {
          if (yaml) {
            console.log({ yaml, filename })
            parseAndDispatchYaml(yaml, filename, element);
          }
        });
      }
    });
  } else {
    element.addEventListener("change", (e) => {
      if (e.target.getAttribute("id") == "load-file") {
        const [file] = e.target.files;
        if (file) {
          const reader = new FileReader();
          reader.addEventListener(
            "load",
            (e) => {
              parseAndDispatchYaml(reader.result, file.name, element);
            },
            false
          );

          reader.readAsText(file);
        }
      }
    });
  }

  render(element);

  element.addEventListener("change", (e) => {
    if (e.target.id == "extra")
    {
      element.dispatchEvent(
        new CustomEvent("extra", { bubbles: true, detail: { enabled: e.target.value } })
    );
  }
  })


  return element;
}
