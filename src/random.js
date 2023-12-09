// Inefficient but OK for small ranges
function range(start, end) {
  if (start === end) return [start]
  return [start, ...range(start + 1, end)]
}

export function randomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  const rnd = Math.floor(Math.random() * (max - min)) + min
  return rnd
}

export function pickRandom(items) {
  const index = randomInt(0, items.length)
  const item = items[index]
  return item
}

function pickRandomEx(items) {
  const index = randomInt(0, items.length)
  const item = items[index]
  const _items = items.filter((i) => i != item)
  return { item, items: _items }
}

export function everyRandomItemPicker(_items /*, key*/) {
  const defult = { item: undefined, items: [..._items] }
  //    const { item, items } = readStorage(key, defult)
  const { item, items } = defult

  return {
    item,
    get value() {
      if (this.item === undefined) {
        this.getNextItem()
      }
      return this.item
    },
    items: items,
    getNextItem() {
      if (!_items.length) {
        return
      }
      if (!this.items.length) {
        this.reset()
      } else {
        ;({ item: this.item, items: this.items } = pickRandomEx(this.items))
      }
      //        this._persist()
    },
    reset() {
      ;({ item: this.item, items: this.items } = defult)
      this.getNextItem()
    },
    /*      _persist() {
        writeStorage(key, { item: this.item, items: this.items })
      },*/
  }
}
