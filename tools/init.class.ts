import * as prompt from 'prompt';
import { mv, which, exec } from 'shelljs'
import * as path from 'path';
import * as cp from 'child_process'
import * as colors from 'colors';
import {
  readFileSync,
  writeFileSync,
  openSync,
  unlinkSync,
  rmdirSync,
  lstatSync
} from 'fs'

const RESOURCES_TO_DELETE = [
  'tools/data.json',
  '.all-contributorsrc',
  '.gitattributes',
  '.git',
]
const FILES_TO_MODIFY = [
  'LICENSE',
  'package.json',
  'rollup.config.ts',
  'test/library.test.ts',
  'tools/gh-pages-publish.ts',
  'sunflower.ts',
]

const FILES_TO_RENAME: Array<string> = [
  'src/library.ts',
  'test/library.test.ts',
]

const SCHEMA_DEFAULTS: any = {
  yesno: {
    description: colors
      .cyan('Chose Yes or No!'),
    pattern: /^(y(es)?|n(o)?)$/i,
    type: 'string',
    required: true,
    message: 'You need to type "Yes" or "No" to continue...'
  },
  kebabcase: {
    description: colors
      .cyan('What do you want the library to be called? (use kebab-case)'),
    pattern: /^[a-z]+(\-[a-z]+)*$/,
    types: 'string',
    required: true,
    message: '`kebab-case` uses lowercase letters, and hyphens for any punctuation'
  }
}

export class InitClass {

  // Init config key/value pairs
  defaultLibraryname: string = 'typescript-library-starter'
  suggestedLibraryName: string = ''
  libraryName: string = ''
  gitUsername: string = ''
  gitUserEmail: string = ''
  projectBasePath: string = ''
  isCI: boolean = false
  storedData: any = null
  storedDataUpdated: boolean = false

  constructor() {

    this.projectBasePath = path.resolve(__dirname, '..')
    this.suggestedLibraryName = this.libraryNameSuggested()

    this.checkAndObtainGitUserData()

    this.isCI = ((process.env
      && process.env.CI
      && (typeof process.env.CI !== 'string' ||
        `${process.env.CI}`.toLowerCase() !== 'false')) || false)
  }

  /**
   * Contains the prompt flow
   */
  async initPrompts(): Promise<void> {

    this.storedData = this.getStoredData()
    if (this.storedData !== null) {

      const proceedWithStoredData: boolean = await this._promptConfirmation(
        'Stored data found! Do you want to start all over?')

      if (proceedWithStoredData) {
        await this._promptLibraryNameCreate()
        await this.setupLibrary(this.libraryName)
      } else {
        const removalConfirmed: boolean = await this._promptConfirmation(
          'Do you want to delete all "init" data? This cannot be reversed!')

        if (removalConfirmed) {
          await this.cleanUpResources()
        }

        this.log('See ya \\w')
        process.exit(0)
      }
    }

    /**
     * Initiate the prompts
     */
    await prompt.start();

    /**
     * Reset the console output
     */
    process.stdout.write('\x1B[2J\x1B[0f');

    this.log('Hi! You\'re almost ready to make the next great TypeScript library.');

    /**
     * Prompt for the library name or use the libray name suggestion
     * if env var `CI` exists with the value `true` and run the tasks.
     */
    if (!this.isCI) {
      if (this.suggestedLibraryName !== this.defaultLibraryname) {
        await this._promptLibraryNameSuggestedConfirmation()
      } else {
        await this._promptLibraryNameCreate()
        await this.setupLibrary(this.libraryName)
      }
    } else {
      /**
       * This is being run in a CI environment,
       * so don't ask any questions and use the
       * suggested library name
       */
      await this.setupLibrary(this.suggestedLibraryName)
    }
  }

  getStoredData(): any {
    const dataJSONPath: string = path.resolve(this.projectBasePath, 'tools/data.json')
    try {
      if (this.localPathExists(dataJSONPath)) {
        const fileContent: string = readFileSync(dataJSONPath).toString();
        return JSON.parse(fileContent)
      }
      return null;
    } catch {
      return null;
    }
  }

  storeData(): void {
    this.log('\nStore data to "./tools/data.json"', 'underline.white')

    const dataJSONPath: string = path.resolve(this.projectBasePath, 'tools/data.json')

    writeFileSync(dataJSONPath, JSON.stringify({
      libraryName: this.libraryName,
      gitUsername: this.gitUsername,
      gitUserEmail: this.gitUserEmail,
      projectBasePath: this.projectBasePath,
    }, null, 2));

    let action: string = 'created'
    if (this.storedData !== null) {
      this.storedDataUpdated = true
      action = 'updated'
    }
    this.log(`File "${dataJSONPath}" ${action}`, 'green')
  }

  /**
   * Renames any template files to the new library name
   */
  renameResources(libraryName: string): void {

    this.log('\nRename resources', 'underline.white')

    FILES_TO_RENAME.forEach((resource: string) => {

      const placeholderName: string = (this.storedData !== null)
        ? this.storedData.libraryName
        : 'library'

      if (this.storedData !== null) {
        resource = resource
          .replace(new RegExp('library', 'gi'), placeholderName)
      }

      const absoluteResourcePath: string =
        path.resolve(this.projectBasePath, resource)

      if (this.localPathExists(absoluteResourcePath)) {

        const newResourceName: string = resource
          .replace(
            new RegExp(placeholderName, 'gi'),
            libraryName)

        mv(
          absoluteResourcePath,
          path.resolve(this.projectBasePath, newResourceName)
        )
        this.log(`Rsource "${resource}" renamed to "${newResourceName}"`, 'green')
      } else {
        this.log(`Rsource  "${resource}" not found (unchanged)`, 'yellow')
      }

    })
  }

  /**
   * Check and try to obtain the local stored Git username and email
   */
  checkAndObtainGitUserData() {
    /**
     * Check whether the Git binary was found
     */
    if (!which('git')) {
      this.log('Git binary not found but required.' +
        ' Install Git with `brew install git` (macOS)' +
        ' or `apt-get install git` (Linux)', 'red')
      process.exit(0)
    }

    this.gitUsername = exec('git config user.name', {
      silent: true
    }).stdout.trim()
    this.gitUserEmail = exec('git config user.email', {
      silent: true
    }).stdout.trim()

    let gitErrors: Array<string> = []
    if (`${this.gitUsername}`.length === 0) {
      gitErrors.push(`Git user name is missing. Set it first with: 'git config user.name = <your_username>' and rerun the init script!`)
    }
    if (`${this.gitUserEmail}`.length === 0) {
      gitErrors.push(`Git user email is missing. Set it first with: 'git config user.email = <your_email>' and rerun the init script!`)
    }

    if (gitErrors.length) {
      gitErrors.forEach(errorMessage => {
        this.log(errorMessage, 'red')
      })
      process.exit(0);
    }
  }

  /**
   * Check whether a file or folder exists
   * @param {string} localPath
   */
  localPathExists (localPath: string): boolean {
    try {
      openSync(localPath, 'r')
      return true
    } catch {
      return false
    }
  }

  /**
   * Generic prompt method to execute confirmation prompts or prompts with input
   * @param {object} schema
   * @param {object} schemaDefault
   */
  async execPrompt(schema: any, schemaDefault: any | undefined): Promise<any> {
    if (typeof schemaDefault !== 'undefined'
      && (schemaDefault in SCHEMA_DEFAULTS)) {
      schema = {
        ...SCHEMA_DEFAULTS[schemaDefault],
        ...schema
      }
      if (schemaDefault === 'yesno') {
        schema.description += ' [yes/no]'
      }
    }
    const { question } = await prompt.get([schema])
    if (schemaDefault === 'yesno') {
      return (`${question}`.toLowerCase().charAt(0) === 'y')
    } else {
      return question
    }
  }

  /**
   * Generic confirmation prompt with `description` argument
   * @param {string} description
   */
  async _promptConfirmation(description: string): Promise<boolean> {
    try {
      return await this.execPrompt({
        description: colors.cyan(description)
      }, 'yesno')
    } catch (err) {
      throw err;
    }
  }

  /**
   * Build the library name from the folder name
   */
  libraryNameSuggested(): string {
    return path
      .basename(path.resolve(__dirname, '..'))
      .replace(new RegExp('[^\\w\\d]|_', 'g'), '-')
      .replace(new RegExp('^-+|-+$', 'g'), '')
      .toLowerCase()
  }

  /**
   * Calls all of the functions needed to setup the library
   * @param {string} libraryName
   */
  async setupLibrary(libraryName: string): Promise<void> {

    this.log('\nThanks for the info. The last few changes are being made... hang tight!')
    this.log(`Library name: "${libraryName}"`, 'yellow')
    this.log(`Git username: "${this.gitUsername}"`, 'yellow')
    this.log(`Git user email: "${this.gitUserEmail}"`, 'yellow')

    await this.modifyContents(libraryName)

    this.storeData()

    /**
     * Run the clean-up method if desired
     */
    const removalConfirmed: boolean = await this._promptConfirmation(
      'Do you want to delete all "init" data? This cannot be reversed!')

    if (removalConfirmed) {
      await this.cleanUpResources()
    } else {
      this.log('OK, you\'re all set. Happy coding!!')
      if (this.storedDataUpdated) {
        process.exit(0)
      }
    }
  }

  /**
   * Run the tasks
   *
   * @param {string} libraryName
   */
  async modifyContents(libraryName: string): Promise<void> {
    this.renameResources(libraryName)
    this.updateResources()
  }

  /**
   * Update resources by replacing placeholders in multiple files
   * with the library name, git username, and git email
   */
  updateResources(): void {

    this.log('\nUpdate resources', 'underline.white')

    let stringPlaceholders: any = {
      'libraryname': this.libraryName,
      'username': this.gitUsername,
      'usermail': this.gitUserEmail,
    }

    if (this.storedData !== null) {
      stringPlaceholders = {
        [this.storedData.libraryName]: this.libraryName,
        [this.storedData.gitUsername]: this.gitUsername,
        [this.storedData.gitUserEmail]: this.gitUserEmail,
      }
    }

    try {
      FILES_TO_MODIFY.forEach((name: string) => {

        const filePath: string = path.join(this.projectBasePath, name)

        if (this.localPathExists(filePath)) {
          let fileContent: string = readFileSync(filePath).toString();

          Object
            .entries(stringPlaceholders)
            .forEach(([key, value]: Array<any>): void => {
              const placeHolder: string = (this.storedData !== null)
                ? `${key}`
                : `--${key}--`
              fileContent = fileContent
                .replace(
                  new RegExp(placeHolder, 'g'),
                  value);
            });

          writeFileSync(filePath, fileContent);
          this.log(`File "${filePath}" updated`, 'yellow')
        }
      })
    } catch (err) {
      throw err
    }
    this.log('\n')
  }

  /**
   * Confirm the suggested library name or create a new one own by choosing "no"
   */
  async _promptLibraryNameSuggestedConfirmation(): Promise<void> {

    const nameConfirmed: boolean = await this._promptConfirmation(
      `Confirm the library name "${this.suggestedLibraryName}"`)

    if (nameConfirmed) {
      await this.setupLibrary(this.suggestedLibraryName)
    } else {
      await this._promptLibraryNameCreate()
      await this.setupLibrary(this.libraryName)
    }
  }

  /**
   * Prompt for the library name which we store in `this.libraryName`
   */
  async _promptLibraryNameCreate(): Promise<void> {
    try {
      this.libraryName = await this.execPrompt({
        description:
          colors
            .cyan(
              'What do you want the library to be called? (use kebab-case)')
      }, 'kebabcase')

      const confirmed: boolean = await this._promptConfirmation(
        `Confirm the library name "${this.libraryName}"`)

      if (!confirmed) {
        await this._promptLibraryNameCreate()
      }
    } catch (err) {
      throw err;
    }
  }

  async cleanUpResources(): Promise<void> {
    this.log('\nRemoving "init" resources', 'underline.white')

    RESOURCES_TO_DELETE
      .forEach(filePath => {
        const absoluteFilePath: string = path.join(this.projectBasePath, filePath)
        try {
          if (lstatSync(absoluteFilePath).isDirectory()) {
            rmdirSync(absoluteFilePath)
          } else {
            unlinkSync(absoluteFilePath)
          }
          this.log(`Resource "${filePath}" deleted`, 'green')
        } catch (err: any) {
          this.log(`Resource "${filePath}" not deleted`, 'red')
        }
      })

    this.log('\nReset Git')

    const packageJSONPath: string = path.join(this.projectBasePath, 'package.json')

    // Recreate Git folder
    const gitInitOutput = exec(
      `git init ${this.projectBasePath}`,
      { silent: true }
    ).stdout.trim()
    this.log(gitInitOutput.replace(new RegExp('(\\n|\\r)+', 'g'), ''), 'green')

    let pkg = JSON.parse(readFileSync(packageJSONPath) as any)

    // Note: Add items to remove from the package file here
    delete pkg.scripts.postinstall
    this.log('\npostinstall script removed from `package.json`', 'green');

    delete pkg.scripts.init
    this.log('scripts.init script removed from `package.json`', 'green');

    writeFileSync(packageJSONPath, JSON.stringify(pkg, null, 2))

    this.log('\ninitialize Husky')
    cp.fork(
      path.join(this.projectBasePath, 'node_modules', 'husky', 'bin', 'install'),
      { silent: true }
    );

    /**
     * Start with a delay to be able to delete last init scripts
     */
    this.log('\nDelete init files')
    const command: string = `rm -rf ${path.join(this.projectBasePath, 'tools/init.ts')} ${path.join(this.projectBasePath, 'tools/init.class.ts')}`
    cp.exec([ 'sleep 2s', command ].join(';'))
    this.log(command, 'green')

    process.exit(0)
  }

  /**
   * Console log helper method to save some characters
   *
   * @param {string} message
   * @param {string?} colorFuncName
   */
  log(message: string, colorFuncName?: string): void {
    const defaultColorName: string = 'cyan'
    const colorName: string = (typeof colorFuncName !== 'undefined'
      && colorFuncName in colors)
      ? colorFuncName
      : defaultColorName

    /**
     * TODO: Investigate why using `colors[colorName](message)` doesn't work
     */
    switch(colorName) {
      default:
      case 'cyan':
        message = colors.cyan(message)
        break;
      case 'red':
        message = colors.red(message)
        break;
      case 'yellow':
        message = colors.yellow(message)
        break;
      case 'green':
        message = colors.green(message)
        break;
      case 'white':
        message = colors.white(message)
        break;
      case 'underline.white':
        message = colors.underline.white(message)
        break;
    }

    console.log(message)
  }
}
