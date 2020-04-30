module.exports = (o, property, file = property, subProperty) =>
  Object.defineProperty(o, property, {
    value: subProperty == null ? require(file) : require(file)[subProperty]
  })[property]
