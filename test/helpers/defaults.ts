import chaiAsPromised from 'chai-as-promised';
import dotenv from 'dotenv';
import AWS from 'aws-sdk';
import path from 'path';
import chai from 'chai';

import { region, profiles } from '../../configs/aws';

const env = dotenv.config({
  path: path.resolve(process.cwd(), '.env.testing')
});

if (env.error) {
  throw env.error;
}

process.env.SERVERLESS_TEST_ROOT = '../../service';

const profile = profiles[process.env.NODE_ENV];

process.env.AWS_PROFILE = profile;

const credentials: AWS.SharedIniFileCredentials = new AWS.SharedIniFileCredentials({
  profile: profiles[String(profile)]
});

AWS.config.update({
  credentials,
  region
});

chai.use(chaiAsPromised);
