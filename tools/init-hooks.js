const path = require('path')
const fork = require('child_process').fork

// Call husky to set up the hooks, based on the commitmsg and postinstall scripts
// from package.json
fork(path.resolve(__dirname, '..', 'node_modules', 'husky', 'bin', 'install'))
