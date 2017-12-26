/**
 * This script runs automatically after your first npm-install.
 */
const _prompt = require("prompt")
const { mv, rm, which, exec } = require("shelljs")
const replace = require("replace-in-file")
const colors = require("colors")
const path = require("path")
const { readFileSync, writeFileSync } = require("fs")
const { fork } = require("child_process")

// Note: These should all be relative to the project root directory
const rmDirs = [
  ".git"
]
const rmFiles = [
  ".all-contributorsrc",
  ".gitattributes",
  "tools/init.ts"
]
const modifyFiles = [
  "LICENSE",
  "package.json",
  "rollup.config.ts",
  "test/library.test.ts",
  "tools/gh-pages-publish.ts"
]
const renameFiles = [
  ["src/library.ts", "src/--libraryname--.ts"],
  ["test/library.test.ts", "test/--libraryname--.test.ts"]
]

const _promptSchemaLibraryName = {
  properties: {
    library: {
      description: colors.cyan(
        "What do you want the library to be called? (use kebab-case)"
      ),
      pattern: /^[a-z]+(\-[a-z]+)*$/,
      type: "string",
      required: true,
      message:
        '"kebab-case" uses lowercase letters, and hyphens for any punctuation'
    }
  }
}

const _promptSchemaLibrarySuggest = {
  properties: {
    useSuggestedName: {
      description: colors.cyan(
        'Would you like it to be called "' +
          libraryNameSuggested() +
          '"? [Yes/No]'
      ),
      pattern: /^(y(es)?|n(o)?)$/i,
      type: "string",
      required: true,
      message: 'You need to type "Yes" or "No" to continue...'
    }
  }
}

_prompt.start()
_prompt.message = ""

// Clear console
process.stdout.write('\x1B[2J\x1B[0f');

if (!which("git")) {
  console.log(colors.red("Sorry, this script requires git"))
  removeItems()
  process.exit(1)
}

// Say hi!
console.log(
  colors.cyan("Hi! You're almost ready to make the next great TypeScript library.")
)

// Generate the library name and start the tasks
if (process.env.CI == null) {
  if (!libraryNameSuggestedIsDefault()) {
    libraryNameSuggestedAccept()
  } else {
    libraryNameCreate()
  }
} else {
  // This is being run in a CI environment, so don't ask any questions
  setupLibrary(libraryNameSuggested())
}



/**
 * Asks the user for the name of the library if it has been cloned into the
 * default directory, or if they want a different name to the one suggested
 */
function libraryNameCreate() {
  _prompt.get(_promptSchemaLibraryName, (err: any, res: any) => {
    if (err) {
      console.log(colors.red("Sorry, there was an error building the workspace :("))
      removeItems()
      process.exit(1)
      return
    }

    setupLibrary(res.library)
  })
}

/**
 * Sees if the users wants to accept the suggested library name if the project
 * has been cloned into a custom directory (i.e. it's not 'typescript-library-starter')
 */
function libraryNameSuggestedAccept() {
  _prompt.get(_promptSchemaLibrarySuggest, (err: any, res: any) => {
    if (err) {
      console.log(colors.red("Sorry, you'll need to type the library name"))
      libraryNameCreate()
    }

    if (res.useSuggestedName.toLowerCase().charAt(0) === "y") {
      setupLibrary(libraryNameSuggested())
    } else {
      libraryNameCreate()
    }
  })
}

/**
 * The library name is suggested by looking at the directory name of the
 * tools parent directory and converting it to kebab-case
 * 
 * The regex for this looks for any non-word or non-digit character, or
 * an underscore (as it's a word character), and replaces it with a dash.
 * Any leading or trailing dashes are then removed, before the string is
 * lowercased and returned
 */
function libraryNameSuggested() {
  return path
    .basename(path.resolve(__dirname, ".."))
    .replace(/[^\w\d]|_/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}

/**
 * Checks if the suggested library name is the default, which is 'typescript-library-starter'
 */
function libraryNameSuggestedIsDefault() {
  if (libraryNameSuggested() === "typescript-library-starter") {
    return true
  }

  return false
}



/**
 * Calls all of the functions needed to setup the library
 * 
 * @param libraryName
 */
function setupLibrary(libraryName: string) {
  console.log(
    colors.cyan(
      "\nThanks for the info. The last few changes are being made... hang tight!\n\n"
    )
  )

  // Get the Git username and email before the .git directory is removed
  let username = exec("git config user.name").stdout.trim()
  let usermail = exec("git config user.email").stdout.trim()

  removeItems()

  modifyContents(libraryName, username, usermail)

  renameItems(libraryName)

  finalize()

  console.log(colors.cyan("OK, you're all set. Happy coding!! ;)\n"))
}

/**
 * Removes items from the project that aren't needed after the initial setup
 */
function removeItems() {
  console.log(colors.underline.white("Removed"))

  // The directories and files are combined here, to simplify the function,
  // as the 'rm' command checks the item type before attempting to remove it
  let rmItems = rmDirs.concat(rmFiles)
  rm("-rf", rmItems.map(f => path.resolve(__dirname, "..", f)))
  console.log(colors.red(rmItems.join("\n")))

  console.log("\n")
}

/**
 * Updates the contents of the template files with the library name or user details
 * 
 * @param libraryName 
 * @param username 
 * @param usermail 
 */
function modifyContents(libraryName: string, username: string, usermail: string) {
  console.log(colors.underline.white("Modified"))

  let files = modifyFiles.map(f => path.resolve(__dirname, "..", f))
  try {
    const changes = replace.sync({
      files,
      from: [/--libraryname--/g, /--username--/g, /--usermail--/g],
      to: [libraryName, username, usermail]
    })
    console.log(colors.yellow(modifyFiles.join("\n")))
  } catch (error) {
    console.error("An error occurred modifying the file: ", error)
  }

  console.log("\n")
}

/**
 * Renames any template files to the new library name
 * 
 * @param libraryName 
 */
function renameItems(libraryName: string) {
  console.log(colors.underline.white("Renamed"))

  renameFiles.forEach(function(files) {
    // Files[0] is the current filename
    // Files[1] is the new name
    let newFilename = files[1].replace(/--libraryname--/g, libraryName)
    mv(
      path.resolve(__dirname, "..", files[0]),
      path.resolve(__dirname, "..", newFilename)
    )
    console.log(colors.cyan(files[0] + " => " + newFilename))
  })

  console.log("\n")
}

/**
 * Calls any external programs to finish setting up the library
 */
function finalize() {
  console.log(colors.underline.white("Finalizing"))

  // Recreate Git folder
  let gitInitOutput = exec('git init "' + path.resolve(__dirname, "..") + '"', {
    silent: true
  }).stdout
  console.log(colors.green(gitInitOutput.replace(/(\n|\r)+/g, "")))

  // Remove post-install command
  let jsonPackage = path.resolve(__dirname, "..", "package.json")
  const pkg = JSON.parse(readFileSync(jsonPackage) as any)

  // Note: Add items to remove from the package file here
  delete pkg.scripts.postinstall

  writeFileSync(jsonPackage, JSON.stringify(pkg, null, 2))
  console.log(colors.green("Postinstall script has been removed"))

  // Initialize Husky
  fork(
    path.resolve(__dirname, "..", "node_modules", "husky", "bin", "install"),
    { silent: true }
  );
  console.log(colors.green("Git hooks set up"))

  console.log("\n")
}
