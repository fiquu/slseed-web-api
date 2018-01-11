# Fi Slseed API

Serveless Seed API project.

# Usage

1. Create a repo.
1. Add remote as slseed:
    - `git remote add slseed git@github.com:FinalDevStudio/fi-slseed-api.git`
1. Disable pushing:
    - `git remote set-url --push slseed DISABLED`
1. Fetch the latest changes:
    - `git fetch slseed`
1. Merge the master into your branch:
    - `git merge slseed/master`

Repeat the last 2 steps to update your repo with the latest changes from this one:

`git fetch slseed && git merge slseed/master`

And have fun resolving conflicts!
