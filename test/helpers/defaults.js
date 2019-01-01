const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const chai = require('chai');

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)
});

mongoose.set('debug', false);

chai.use(chaiAsPromised);
