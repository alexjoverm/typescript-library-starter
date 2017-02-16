const prompt = require('prompt')
const { mv, rm, which, exec } = require('shelljs')
const replace = require('replace-in-file')
const colors = require('colors')
const path = require('path')
const fork = require('child_process').fork

const promptSchema = {
  properties: {
    library: {
      description: colors.cyan('Enter your library name (use kebab-case)'),
      pattern: /^[a-z]+(\-[a-z]+)*$/,
      type: 'string',
      required: true
    }
  }
}

const files = ['package.json', 'webpack.config.ts']

prompt.start()
prompt.message = ''


if (!which('git')) {
  console.log(colors.red('Sorry, this script requires git'))
  process.exit(1)
}


// 1. Remove .git folder
rm('-Rf', path.resolve(__dirname, '..', '.git'))

// 2. Ask for library name
prompt.get(promptSchema, (err, res) => {
  if (!err) {
    // 3. Replace strings in corresponding files
    replace({
      files,
      from: /--libraryname--/g,
      to: res.library
    }, () => {
      // 4. Rename main file and test
      const renamedFiles = [`src/${res.library}.ts`, `test/${res.library}.test.ts`]
      mv(path.resolve(__dirname, '..', 'src/library.ts'), path.resolve(__dirname, '..', renamedFiles[0]))
      mv(path.resolve(__dirname, '..', 'test/library.test.ts'), path.resolve(__dirname, '..', renamedFiles[1]))

      console.log()
      console.log(colors.cyan(renamedFiles.join(',')) + ' renamed')
      console.log(colors.cyan(files.join(',')) + ' updated')

      // 5. Recreate init folder and initialize husky
      exec('git init ' + path.resolve(__dirname, '..'))
      fork(path.resolve(__dirname, '..', 'node_modules', 'husky', 'bin', 'install'))

      console.log()
      console.log(colors.green('Happy coding!! ;)'))
      console.log()
    })
  }
})

