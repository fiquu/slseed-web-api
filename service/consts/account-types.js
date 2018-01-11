module.exports = {};

['FACEBOOK', 'TWITTER', 'GOOGLE', 'EMAIL'].forEach(item => {
  Object.defineProperty(module.exports, item, {
    value: `ACCOUNT_TYPE.${item}`,
    enumerable: true
  });
});
