# @fiquu/slseed-web-api

Serveless Seed API project.

## What's included

- Easy project and service configuration.
- Logical folder structure.
- Simplified authorization handling.
- Simplified database connection management with Mongoose.
- Simplified HTTP response handling.
- Mailing integration with AWS SES.

## Getting started

1. Create an IAM programattic user (recommended) and configure with the AWS CLI: `aws configure --profile <profile-name>`.
1. Configure your AWS profile names on `configs/aws.js` for each stage. Must match the profile names configured with the AWS CLI.
1. Run `npm i`, `update` and `audit fix` as needed.
1. Set the input values to use on the CloudFormation template on `setup/stack/values.js`.
1. Configure your CloudFormation template on the `setup/stack/template/` folder.
1. Run `npm run setup`, select `stack`, select the target stage and enter the template values.
1. Wait for it to finish (it may take a while)...
1. Configure your SSM to `.env` values mapping on `configs/ssm.env.js` with the SSM param names only without path prefixes as defined on yout CloudFormation template.
1. Run `npm run setup`, select `env` and select target stage to create or update your `.env.{stage}` file.
1. Run `npm start`.

That's it. Your App should be running wherever it says it's running.

See the `"scripts"` section on the `package.json` for more commands.

## Running Scripts

We've bundled some utility scripts that you may find useful while developing or maintaining your app. To run them, user `ts-node` like this:

`$ ts-node scripts/users/create.ts`

You can also run any script defined on the `package.json` with `npm run list`.

## Deploying

1. Make sure you have the `.env` file for the stage you want to deploy by running `npm run setup`, selecting the stage and checking if the `.env.[stage]` exists.
1. Run `npm run deploy` and select stage.

## Email Templates

SES email template uploading are handled by https://github.com/haftahave/serverless-ses-template.

To edit your templates, open the `email/templates` folder and modify or create as you see fit.

To use a format other than the default with Pug, just modify the loader on `configs/ses/templates.js`.

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
