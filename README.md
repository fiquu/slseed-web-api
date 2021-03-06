# @fiquu/slseed-web-api

[Serveless](https://www.serverless.com/) Seed API project using [AWS CloudFormation](https://aws.amazon.com/cloudformation/) (base values and resources), [AWS Systems Manager](https://aws.amazon.com/systems-manager/) (for parameters), [AWS Lambda](https://aws.amazon.com/lambda/) (endpoint handlers), [Amazon API Gateway](https://aws.amazon.com/api-gateway/) (REST and GraphQL enpoints), [Amazon Simple Email Service](https://aws.amazon.com/ses/) (well, emails), [Amazon Cognito](https://aws.amazon.com/cognito/) (users and auth) and [MongoDB](https://www.mongodb.com/cloud/atlas) (database).

## What's included

- Easy project and service configuration.
- Logical folder structure.
- Simplified authorization handling.
- Simplified database connection management with [Mongoose](https://mongoosejs.com/) (MongoDB).
- Simplified HTTP response handling.
- [GraphQL](https://graphql.org/) lambda endpoint.
- REST endpoint.
- Mailing integration with Amazon Simple Email Service.

**Anything can be removed or changed,** so if you need to create a service to just handle [S3](https://aws.amazon.com/s3/) events, you can just leave a function to handle that. There are no limitations.

## Getting started

1. Clone this repo into a folder.
1. Update the `"name"` and `"title"` properties on the `package.json` file. These will be used by the CloudFormation template and Serverless to identify the project.
1. Create an IAM programmatic-only user (recommended) and configure the credentials with the AWS CLI: `aws configure --profile <profile-name>`.
1. Configure your AWS profile names on `configs/aws.js` for each stage. Must match the profile names configured with the AWS CLI.
1. Run `npm i`, `update` and `audit fix` as needed.
1. Set the input values to use on the CloudFormation template on `setup/stack/values.js`.
1. Configure your CloudFormation template on the `setup/stack/template/` folder.
1. Run `npm run setup`, select `stack`, select the target stage and enter the template values.
1. Wait for it to finish (it may take a while)...
1. Configure your SSM to `.env` values mapping on `configs/ssm.env.js` with the SSM param names only without path prefixes as defined on yout CloudFormation template.
1. Run `npm run setup`, select `env` and select target stage to create or update your local `.env.<stage>` file.
1. Run `npm start`.

That's it. Your App should be running wherever it says it's running.

See the `"scripts"` section on the `package.json` for more commands.

#### Separate stacks

We decided to use separate stacks to avoid dependencies between the Serverless and base stacks. The base stack may contain references to Cognito  or other critical services that should not be deleted when removing the Serverless service or modified on every deploy.

This could be solved with the [Serverless Plugin Additional Stacks](https://github.com/nordcloud/serverless-plugin-additional-stacks) but we needed an easy way to setup and configure reproductible environments on each stage.

### Running Scripts

We've bundled some utility scripts that you may find useful while developing or maintaining your app. To run them, user `ts-node` like this:

`$ ts-node scripts/users/create.ts`

You can also run any script defined on the `package.json` with `npm run list`.

### Email templates

SES email template uploading are handled by the [Serverless SES Template](https://github.com/haftahave/serverless-ses-template) plugin.

To edit your templates, open the `email/templates/` folder and modify or create as you see fit.

To use a format other than the default with Pug, just modify the loader on `configs/ses/templates.js`.

### GraphQL

GraphQL is included with [Apollo Server Lambda](https://github.com/apollographql/apollo-server/tree/main/packages/apollo-server-lambda).

See the `service/entities/` folder to add or create entities.

Modify the `service/configs/graphql.ts` file to change your resolvers (must be added manually).

### Deploying

1. Make sure you have the `.env` file for the stage you want to deploy by running `npm run setup:env`, selecting the target stage and checking if the `.env.<stage>` file exists.
1. Run `npm run deploy` and select stage.

You can also append the `--stage <stage>` to the command: `npm run deploy -- --stage development`.

### CI/CD

To integrate with your CI/CD service just use `npm run setup:env -- --stage <stage>` and then `npm run deploy -- --stage <stage>` commands. This will pull the env values from SSM and create a `.env.<stage>` file that the `dotenv` plugin will pick on deploy.

## Using as seed

1. Create a repo.
1. Add remote as slseed:
    - `git remote add slseed git@github.com:fiquu/slseed-web-api.git`
1. Disable pushing:
    - `git remote set-url --push slseed DISABLED`
1. Fetch the latest changes:
    - `git fetch slseed`
1. Merge the master into your branch:
    - `git merge slseed/master --allow-unrelated-histories`

Repeat the last 2 steps to update your repo with the latest changes from this one:

`git fetch slseed && git merge slseed/master --allow-unrelated-histories`

And have fun resolving conflicts!
