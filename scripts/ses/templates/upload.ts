import confirmPrompt from '@fiquu/slseed-web-utils/lib/confirm-prompt';
import stageSelect from '@fiquu/slseed-web-utils/lib/stage-select';
import { minify } from 'html-minifier';
import htmlToText from 'html-to-text';
import { prompt } from 'inquirer';
import { basename } from 'path';
import dotenv from 'dotenv';
import juice from 'juice';
import chalk from 'chalk';
import AWS from 'aws-sdk';
import glob from 'glob';
import ora from 'ora';
import pug from 'pug';

const spinner = ora();

console.log(`${chalk.cyan.bold('SES Email Template Upload Script')}\n`);

(async (): Promise<void> => {
  await stageSelect();

  const env = dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

  if (env.error) {
    throw env.error;
  }

  spinner.start('Listing templates...');

  const files = glob.sync('./email/templates/**/*.pug');

  spinner.stop();

  const { file } = await prompt([
    {
      name: 'file',
      type: 'list',
      message: 'Select email template:',
      default: true,
      choices: files.map(file => ({
        name: `${basename(file, '.pug')} (${file.replace(process.cwd(), '')})`,
        value: file.replace(process.cwd(), '')
      }))
    }
  ]);

  spinner.start('Reading and parsing template...');

  let template: string;

  try {
    template = minify(pug.renderFile(file), {
      collapseWhitespace: true,
      removeComments: false, // Leave comments so we can parse the info
      minifyCSS: true
    });
  } catch (err) {
    spinner.fail(err.message);

    throw err;
  }

  const TemplateName = template.replace(/.*SES\.TemplateName\s*=\s*"([^"]+)".*/, '$1');
  const SubjectPart = template.replace(/.*SES\.SubjectPart\s*=\s*"([^"]+)".*/, '$1');

  spinner.info(`${chalk.bold('TemplateName: ')}${TemplateName}`);
  spinner.info(`${chalk.bold('SubjectPart:  ')}${SubjectPart}`);

  if (!(await confirmPrompt('Are the above values correct?'))) {
    spinner.warn('Canceled.');

    return;
  }

  const ses = new AWS.SES();
  let exists = false;

  spinner.start('Checking if template exists...');

  try {
    exists = Boolean(await ses.getTemplate({ TemplateName }).promise());
  } catch (err) { }

  try {
    const params = {
      Template: {
        TextPart: htmlToText.fromString(template),
        TemplateName,
        SubjectPart,
        HtmlPart: minify(juice(template), {
          removeComments: true // Now remove comments
        })
      }
    };

    if (exists) {
      spinner.warn('Template already exists!');

      if (!(await confirmPrompt('Update template?'))) {
        spinner.warn('Update canceled.');

        return;
      }

      spinner.start('Updating template...');

      await ses.updateTemplate(params).promise();

      spinner.succeed('Template updated!');

      return;
    }

    spinner.start('Creating template...');

    await ses.createTemplate(params).promise();

    spinner.succeed('Template created!');
  } catch (err) {
    spinner.fail(err.message);
    process.exitCode = 1;
  }
})();
