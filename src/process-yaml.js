import { parse, stringify } from 'yaml'

export function getYaml() {
  return localStorage.getItem("yaml")
}

export function storeYaml(yaml) {
  localStorage.setItem("yaml", yaml)
} 

export function parseAndDispatchYaml(yaml, filename, element) {
  try {
    const parameterCollection = parse(yaml)
    const thisObj = { title: 'Musical Parameters' }
    const params = parameterCollection.filter(function (el) { if (el.title) { this.title = el.title; return false } else { return true } }, thisObj)
    element.dispatchEvent(
      new CustomEvent('dataload', {
        bubbles: true,
        detail: { title: thisObj.title, parameterCollection: params, filename },
      })
    )
  } catch (e) {
    throw new ErrorEvent('Parameter file error', {
      message: `An error occurred reading '${filename}':\n\n${e.message}\n\nYou might like to use a tool like https://jsonformatter.org/yaml-validator`,
    })
  }
}
