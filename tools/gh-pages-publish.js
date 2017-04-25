let { cd, exec, echo, touch } = require('shelljs')
let { readFileSync } = require('fs')
let url = require('url')

let repoUrl;
let pkg = JSON.parse(readFileSync('package.json'))
if (typeof pkg.repository === 'object') {
    if (!pkg.repository.hasOwnProperty('url')) {
        throw new Error("URL does not exist in repository section")
    }
    repoUrl = pkg.repository.url
} else {
    repoUrl = pkg.repository
}

var parsedUrl = url.parse(repoUrl)
let repository = parsedUrl.host + parsedUrl.path;
let ghToken = process.env.GH_TOKEN

echo('Deploying docs!!!')
cd('dist/docs')
touch('.nojekyll')
exec('git init')
exec('git add .')
exec('git commit -m "docs(docs): update gh-pages"')
exec(`git push --force --quiet "https://${ghToken}@${repository}" master:gh-pages`)
echo('Docs deployed!!')
