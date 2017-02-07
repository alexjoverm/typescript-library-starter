let { cd, exec, echo, touch } = require('shelljs')
let { readFileSync } = require('fs')
let url = require('url')

let pkg = JSON.parse(readFileSync('package.json'))
let repository = url.parse(pkg.repository)
repository = repository.host + repository.path
let ghToken = process.env.GH_TOKEN

echo('Deploying docs!!!')
cd('dist/docs')
touch('.nojekyll')
exec('git init')
exec('git config user.name "Alex Jover Morales"')
exec('git config user.email "alexjovermorales@gmail.com"')
exec('git add .')
exec('git commit -m "docs(docs): update gh-pages"')
exec(`git push --force --quiet "https://${ghToken}@${repository}" master:gh-pages`)
echo('Docs deployed!!')