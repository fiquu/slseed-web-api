import chaiAsPromised from 'chai-as-promised';
import dotenv from 'dotenv';
import AWS from 'aws-sdk';
import path from 'path';
import chai from 'chai';

import { region, profiles } from '../../configs/aws';

dotenv.config({
  path: path.resolve(process.cwd(), '.env.test')
});

process.env.MONGOMS_SYSTEM_BINARY = '/usr/bin/mongod';
process.env.SERVERLESS_TEST_ROOT = '../../service';

const profile = profiles[String(process.env.NODE_ENV)];

process.env.AWS_PROFILE = String(profile);

const credentials: AWS.SharedIniFileCredentials = new AWS.SharedIniFileCredentials({
  profile: profiles[String(profile)]
});

AWS.config.update({
  credentials,
  region
});

chai.use(chaiAsPromised);
