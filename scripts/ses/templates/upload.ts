import confirmPrompt from '@fiquu/slseed-web-utils/lib/confirm-prompt';
import stageSelect from '@fiquu/slseed-web-utils/lib/stage-select';
import { minify } from 'html-minifier';
import htmlToText from 'html-to-text';
import { readFileSync } from 'fs';
import { prompt } from 'inquirer';
import dotenv from 'dotenv';
import juice from 'juice';
import chalk from 'chalk';
import AWS from 'aws-sdk';
import glob from 'glob';
import ora from 'ora';

const spinner = ora();

(async (): Promise<void> => {
  await stageSelect();

  const env = dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

  if (env.error) {
    throw env.error;
  }

  console.log(`${chalk.cyan.bold('SES Email Template Upload Script')}\n`);

  spinner.start('Listing templates...');

  const files = glob.sync('./email/**/*.html');

  spinner.stop();

  const { file } = await prompt([
    {
      name: 'file',
      type: 'list',
      message: 'Select HTML template:',
      default: true,
      choices: files.map(file => file.replace(process.cwd(), ''))
    }
  ]);

  spinner.start('Reading and parsing template...');

  const template = readFileSync(file).toString();
  let TemplateName: string;
  let SubjectPart: string;

  // Extract template values
  template.split(/\r?\n/).forEach(line => {
    const _line = line.trim();

    if (/^Template\.TemplateName\s*=\s*.+$/.test(_line)) {
      TemplateName = _line.replace(/^Template\.TemplateName\s*=\s*(.+)$/, '$1');
    }

    if (/^Template\.SubjectPart\s*=\s*.+$/.test(_line)) {
      SubjectPart = _line.replace(/^Template\.SubjectPart\s*=\s*(.+)$/, '$1');
    }
  });

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
        HtmlPart: juice(minify(template, {
          collapseWhitespace: true,
          removeComments: true,
          minifyCSS: true
        }))
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
  }
})();
