module.exports = {};

['CITIZEN', 'MONITOR'].forEach(item => {
  Object.defineProperty(module.exports, item, {
    value: `SENDER.${item}`,
    enumerable: true
  });
});
