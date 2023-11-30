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

export function createControls(hasMedia = false, extra = null) {
  function render(element) {
    element.className = "controls";
    element.innerHTML = `
    <div><a href="/docs/">About</a>
    ${hasFileSystemAccessAPI 
        ? `<button style="border:0;" id="load-file" title="Load from file" aria-label="Load file">Load</button>`
        : `<label id="load-label" aria-label="Load file">Load
        <input id="load-file" type="file" accept="text/yaml,.yaml" class="visually-hidden">
      </label>
      `
      }</div>
    ${(extra !== null) ? `<label>Values: <select id="extra">
          <option ${(extra == 0) ? 'selected' : ''} value="0">Values</option>
          <option ${(extra == 1) ? 'selected' : ''} + value="1">Both</option>
          <option ${(extra == 2) ? 'selected' : ''} + value="2">Extra</option>
          </select></label>` : ''}
    ${(hasMedia) ? '<audio id="player" controls loop></audio><label title="Pick new values at end of play"><input type="checkbox" id="autonext" />New values at end</label>' : ''}
    `;
  }

  const element = document.createElement("div");

  if (hasFileSystemAccessAPI) {
    element.addEventListener("click", (e) => {
      if (e.target.id == "load-file") {
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
    if (e.target.id == "extra") {
      element.dispatchEvent(
        new CustomEvent("extra", { bubbles: true, detail: { enabled: e.target.value } })
      );
    }
  })


  return element;
}
