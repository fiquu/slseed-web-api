import { join, dirname, basename, extname, resolve } from 'path';
import { fromString } from 'html-to-text';
import { minify } from 'html-minifier';
import juice from 'juice';
import fs from 'fs-extra';
import glob from 'glob';
import pug from 'pug';

const files = glob.sync('email/templates/**/*.pug');

for (const file of files) {
  const inFile = resolve(file);
  const outFileHtml = `${basename(file, extname(file))}.html`;
  const outFileText = `${basename(file, extname(file))}.txt`;
  const outDir = join(__dirname, 'rendered', dirname(file.replace('email/', '')));
  const html = pug.renderFile(inFile);

  fs.ensureDirSync(outDir);
  fs.ensureFileSync(join(outDir, outFileHtml));
  fs.ensureFileSync(join(outDir, outFileText));

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.writeFileSync(join(outDir, outFileHtml), minify(juice(html), {
    removeComments: true,
    minifyCSS: true
  }));

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.writeFileSync(join(outDir, outFileText), fromString(html));
}
