function randomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  const rnd = Math.floor(Math.random() * (max - min)) + min
  return rnd
}

function pickRandom(items) {
  const index = randomInt(0, items.length)
  const item = items[index]
  const _items = items.filter((i) => i != item)
  return { item, items: _items }
}

export function persistedRandomItem(_items /*, key*/) {
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
        ;({ item: this.item, items: this.items } = pickRandom(this.items))
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
