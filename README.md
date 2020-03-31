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

1. Configure your AWS profiles on `configs/aws.js` for each stage.
1. Run `npm i` and update as needed.
1. Set the input values to use on the CloudFormation template on `setup/stack/values.js`.
1. Configure your CloudFormation template on the `setup/stack/template/` folder.
1. Run `npm run setup`, select `stack`, select stage and enter the template values.
1. Wait for it to finish (it may take a while)...
1. Configure your SSM to `.env` values on `configs/ssm.env.js` (these are the SSM param names only).
1. Run `npm run setup`, select `env` and select stage to set your `.env.{stage}` file.
1. Run `npm start`.

That's it. Your App should be running wherever it says it's running.

See the `"scripts"` section on the `package.json` for more commands.

## Running Scripts

We've bundled some utility scripts that you may find useful while developing or maintaining your app. To run them, user `ts-node` like this:

`$ ts-node scripts/users/create.ts`

## Deploying

1. Make sure you have the `.env` file for the stage you want to deploy by running `npm run setup`, selecting the stage and checking if the `.env.[stage]` exists.
1. Run `npm run deploy` and select stage.

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
