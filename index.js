module.exports = m => (o, property, file = property, subProperty) =>
  Object.defineProperty(o, property, {
    value: subProperty == null ? m.require(file) : m.require(file)[subProperty]
  })[property]
