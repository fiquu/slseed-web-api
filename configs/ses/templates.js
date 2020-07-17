const { minify } = require('html-minifier');
const htmlToText = require('html-to-text');
const juice = require('juice');
const glob = require('glob');
const pug = require('pug');

/**
 * @param {object} serverless Serverless instance
 * @param {object} options runtime options
 *
 * @returns {Promise<object[]>} A promise to the templates.
 *
 * @see https://github.com/haftahave/serverless-ses-template
 */
module.exports = async (serverless, options) => {
  const files = glob.sync('email/templates/**/*.pug');

  const sesEmailTemplates = files.map(file => {
    const template = minify(pug.renderFile(file), {
      collapseWhitespace: true,
      removeComments: false, // Leave comments so we can parse the info
      minifyCSS: true
    });

    const subject = template.replace(/.*SES\.SubjectPart\s*=\s*"([^"]+)".*/, '$1');
    const name = template.replace(/.*SES\.TemplateName\s*=\s*"([^"]+)".*/, '$1');

    return {
      name,
      subject,
      text: htmlToText.fromString(template),
      html: minify(juice(template), {
        removeComments: true // Now remove comments
      })
    };
  });

  return sesEmailTemplates;
};
