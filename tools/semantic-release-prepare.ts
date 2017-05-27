const path = require('path')
const fork = require('child_process').fork
const colors = require('colors')

const { readFileSync } = require('fs')
const pkg = JSON.parse(readFileSync(path.resolve(__dirname, '..', 'package.json')))

// Call husky to set up the hooks, based on the commitmsg and postinstall scripts
// from package.json
fork(path.resolve(__dirname, '..', 'node_modules', 'husky', 'bin', 'install'))

console.log()
console.log(colors.green('Done!!'))
console.log()

if(pkg.repository.url.trim()) {
  console.log(colors.cyan('Now run:'))
  console.log(colors.cyan('  npm install -g semantic-release-cli'))
  console.log(colors.cyan('  semantic-release setup'))
  console.log()
  console.log(colors.cyan('Important! Answer NO to "Generate travis.yml" question'))
  console.log()
  console.log(colors.gray('Note: Make sure "repository.url" in your package.json is correct before'))
} else {
  console.log(colors.red('First you need to set the "repository.url" property in package.json'))
  console.log(colors.cyan('Then run:'))
  console.log(colors.cyan('  npm install -g semantic-release-cli'))
  console.log(colors.cyan('  semantic-release setup'))
  console.log()
  console.log(colors.cyan('Important! Answer NO to "Generate travis.yml" question'))
}

console.log()