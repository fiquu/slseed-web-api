import SES from 'aws-sdk/clients/ses';
import { expect } from 'chai';
import faker from 'faker';

const ses = new SES({
  region: 'us-east-1'
});

describe('confirmation email', function () {
  this.timeout(30000);

  it('does not renders the template without proper values', async function () {
    const task = ses.testRenderTemplate({
      TemplateName: 'Welcome',
      TemplateData: JSON.stringify({})
    }).promise();

    await expect(task).to.eventually.be.rejectedWith(Error);
  });

  it('properly renders the template with proper values', async function () {
    const task = ses.testRenderTemplate({
      TemplateName: 'Welcome',
      TemplateData: JSON.stringify({
        user: {
          name: faker.name.firstName()
        }
      })
    }).promise();

    await expect(task).to.eventually.be.an('object').with.keys(
      'ResponseMetadata', 'RenderedTemplate'
    );
  });
});
