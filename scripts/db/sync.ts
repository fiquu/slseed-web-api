import confirmPrompt from '@fiquu/slseed-web-utils/lib/confirm-prompt';
import stageSelect from '@fiquu/slseed-web-utils/lib/stage-select';
import mongoose, { Connection } from 'mongoose';
import { resolve } from 'path';
import dotenv from 'dotenv';
import chalk from 'chalk';
import ora from 'ora';

const spinner = ora();

/**
 * Initializes env.
 */
async function init(): Promise<void> {
  await stageSelect();

  const env = dotenv.config({ path: resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });

  if (env.error) {
    throw env.error;
  }

  mongoose.set('debug', true);
}

/**
 * Syncs the database indexes.
 *
 * @param {Connection} conn The connection.
 *
 * @returns {Promise<void>} A promise to the operation.
 */
async function syncIndexes(conn: Connection): Promise<void> {
  spinner.info('Syncing indexes...');

  for (const name of conn.modelNames()) {
    await conn.model(name).syncIndexes();
  }

  spinner.succeed('Indexes synced');
}

console.log(`\n${chalk.cyan.bold('Sync Database Indexes Script')}\n`);

(async (): Promise<void> => {
  let db;

  try {
    await init();

    db = (await import('../../service/components/database')).default; // ?

    spinner.info(`${chalk.bold('Target database:')} "default"`);

    if (!(await confirmPrompt('Proceed with index syncing?'))) {
      spinner.warn('Canceled');
      return;
    }

    const conn = await db.connect('default');

    await syncIndexes(conn);
  } catch (err) {
    spinner.fail(err.message);
  }

  await db.disconnect('default');
})();
