let { cd, exec, echo } = require('shelljs')
let { readFileSync } = require('fs')

let pkg = JSON.parse(readFileSync('package.json'))
let repository = pkg.repository
let ghToken = process.env.GH_TOKEN

echo('Deploying docs!!')
echo(`${repository} ${ghToken}`)
cd('dist/docs')
exec('pwd')
exec('git init')
exec('git config user.name "Travis-CI"')
exec('git config user.email "travis@ci.com"')
exec('git add .')
exec('git commit -m "Update gh-pages"')
exec(`git push --force --quiet "https://${ghToken}@${repository}" master:gh-pages > /dev/null 2>&1`)
echo('Docs deployed!!')