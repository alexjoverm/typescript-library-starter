let { cd, exec, echo } = require('shelljs')
let { readFileSync } = require('fs')
let url = require('url')

let pkg = JSON.parse(readFileSync('package.json'))
let repository = url.parse(pkg.repository)
let repository = repository.host + repository.path
let ghToken = process.env.GH_TOKEN

echo('Deploying docs!!')
echo(`${repository} ${ghToken}`)
cd('dist/docs')
exec('pwd')
exec('git init')
exec('git config user.name "Alex Jover Morales"')
exec('git config user.email "alexjovermorales@gmail.com"')
exec('git add .')
exec('git commit -m "Update gh-pages"')
exec(`git push --force "https://${ghToken}@${repository}" master:gh-pages`)
echo('Docs deployed!!')