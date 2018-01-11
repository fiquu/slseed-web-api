module.exports = {};

['FEMALE', 'MALE', 'NONE'].forEach(item => {
  Object.defineProperty(module.exports, item, {
    value: `GENDER.${item}`,
    enumerable: true
  });
});
