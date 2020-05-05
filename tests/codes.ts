import rand from 'randomatic';

const stash = [];
const l = 1000000;
let cols = 0;

console.log(`Generating ${l} codes...`);

for (let i = 0; i < l; i++) {
  const val = rand('A0', 8);

  if (stash.includes(val)) {
    console.log(val, 'exists!');
    cols++;
  } else {
    stash.push(val);
  }
}

console.info(stash);
console.log('Colissions:', cols);
