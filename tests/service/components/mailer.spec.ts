import '../../helpers/defaults'; // Always load first

import { PromiseResult } from 'aws-sdk/lib/request';
import { SES, AWSError } from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { expect } from 'chai';
import faker from 'faker';

import { send } from '../../../service/components/mailer';

describe('component database', function () {
  this.timeout(5000);

  it('sends', async function () {
    const res: SES.SendTemplatedEmailResponse = {
      MessageId: faker.random.uuid()
    };

    AWSMock.mock('SES', 'sendTemplatedEmail', Promise.resolve(res));

    const params: Omit<SES.SendTemplatedEmailRequest, 'Source'> = {
      Template: faker.random.alphaNumeric(),
      // Source: faker.internet.email(),
      TemplateData: '',
      Destination: {
        ToAddresses: [faker.internet.email()]
      }
    };

    await expect(send(params)).to.eventually.deep.equal(res);
  });
});
