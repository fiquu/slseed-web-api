module.exports = {};

for (let item of ['FEMALE', 'MALE', 'NONE']) {
  Object.defineProperty(module.exports, item, {
    value: `GENDER.${item}`,
    enumerable: true
  });
}
