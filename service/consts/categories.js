module.exports = {};

[
  'EMERGENCIES',
  'ENVIRONMENT',
  'SIGNAGE',
  'SERVICES',
  'TOWN_HALL',
  'SOCIAL',
  'HEALTH',
  'EDUCATION',
  'SPORTS',
  'PETS',
  'TRANSIT',
  'OTHER'
].forEach(item => {
  Object.defineProperty(module.exports, item, {
    value: `CATEGORY.${item}`,
    enumerable: true
  });
});
