import * as path from 'path'
import { fork } from 'child_process'
const _colors = require('colors')

const { readFileSync } = require('fs')
const pkg = JSON.parse(readFileSync(path.resolve(__dirname, '..', 'package.json')))

// Call husky to set up the hooks, based on the commitmsg and postinstall scripts
// from package.json
fork(path.resolve(__dirname, '..', 'node_modules', 'husky', 'bin', 'install'))

console.log()
console.log(_colors.green('Done!!'))
console.log()

if (pkg.repository.url.trim()) {
  console.log(_colors.cyan('Now run:'))
  console.log(_colors.cyan('  npm install -g semantic-release-cli'))
  console.log(_colors.cyan('  semantic-release setup'))
  console.log()
  console.log(_colors.cyan('Important! Answer NO to "Generate travis.yml" question'))
  console.log()
  console.log(_colors.gray('Note: Make sure "repository.url" in your package.json is correct before'))
} else {
  console.log(_colors.red('First you need to set the "repository.url" property in package.json'))
  console.log(_colors.cyan('Then run:'))
  console.log(_colors.cyan('  npm install -g semantic-release-cli'))
  console.log(_colors.cyan('  semantic-release setup'))
  console.log()
  console.log(_colors.cyan('Important! Answer NO to "Generate travis.yml" question'))
}

console.log()
