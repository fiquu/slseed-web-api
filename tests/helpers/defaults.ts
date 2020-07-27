import chaiAsPromised from 'chai-as-promised';
import dotenv from 'dotenv';
import chai from 'chai';

dotenv.config({
  path: '.env.test'
});

chai.use(chaiAsPromised);

process.env.MONGOMS_SYSTEM_BINARY = process.env.MONGOMS_SYSTEM_BINARY || '/usr/bin/mongod';
process.env.SERVERLESS_TEST_ROOT = '../../service';

