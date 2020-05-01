module.exports = m => (property, file, subProperty) => {
  return Object.defineProperty(m.exports, property, {
    value: subProperty == null ? m.require(file) : m.require(file)[subProperty]
  })[property]
}
