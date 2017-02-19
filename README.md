# Typescript library starter

Starter project for creating a typescript library extremely easy.

### Usage

```bash
git clone https://github.com/alexjoverm/typescript-library-starter.git YOURFOLDERNAME
cd YOURFOLDERNAME

# Run npm install and write your library name when asked. That's all!
npm install
```

**Start coding!** The `package.json` file is already set up for you, so don't worry about linking to your main file, typings, etc. Just keep those files with the same names.

### Features

 - Zero-setup. After running `npm install` things will be setup for you :wink:
 - UMD bundle generated, using **[Webpack 2](https://webpack.js.org/)**
 - Tests, coverage and interactive watch mode using **[Jest](http://facebook.github.io/jest/)**
 - **Docs automatic generation and deployment** to `gh-pages`, using **[TypeDoc](http://typedoc.org/)**
 - Automatic types file generation
 - **[TSLint](https://palantir.github.io/tslint/)** ([standard-config](https://github.com/blakeembrey/tslint-config-standard)) for your code styling
 - **[Travis](https://travis-ci.org)** integration and **[Coveralls](https://coveralls.io/)** report
 - (Optional) **Automatic releases and changelog**, using [Semantic release](https://github.com/semantic-release/semantic-release), [Commitizen](https://github.com/commitizen/cz-cli), [Conventional changelog](https://github.com/conventional-changelog/conventional-changelog) and [Husky](https://github.com/typicode/husky) (for the git hooks)

### NPM scripts

 - `npm t`: Run test suite
 - `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
 - `npm run test:prod`: Run linting + generate coverage
 - `npm run build`: Bundles code, create docs and generate typings
 - `npm run commit`: Commit using conventional commit style ([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:)

### Automatic releases

If you'd like to have automatic releases with **Semantic Versioning**, follow these simple steps.

_**Prerequisites**: you need to create/login accounts and add your project to:_
 - NPM
 - Travis
 - Coveralls

Install semantic release and run it (Answer NO to "Generate travis.yml")

```bash
npm install -g semantic-release-cli
semantic-release setup
# IMPORTANT!! Answer NO to "Generate travis.yml" question. Is already prepared for you :P
```

Automatic releases are possible thanks to [semantic release](https://github.com/semantic-release/semantic-release), which publishes your code **automatically on github and npm**, plus generates **automatically a changelog**.

### GitHooks

By default, 2 githooks are **enabled** using [husky](https://github.com/typicode/husky). It's suggested to keep them, since they make sure:
 - You follow a [conventional commit message](https://github.com/conventional-changelog/conventional-changelog)
 - Your build is not gonna fail in [Travis](https://travis-ci.org) (or your CI server), since it's runned locally before `git push`

You **can disable** them. Read [FAQ section](#faq).

### FAQ

#### What if I don't want automatic releases or semantic-release?

Then you may want to:
 - Remove `commitmsg`, `postinstall` scripts from `package.json`. That will not use those git hooks to make sure you make a conventional commit
 - Remove `npm run semantic-release` from `.travis.yml`

#### What if I don't want to use coveralls or report my coverage?

Remove `npm run report-coverage` from `.travis.yml`

#### What is `npm install` doing the first time runned?

It runs the script `tools/init` which sets up everything for you. In short, it:
 - Configures webpack for the build, which creates the umd library, generate docs, etc.
 - Configures `package.json` (typings file, main file, etc)
 - Renames main src and test files

## Credits

Made with :heart: by [@alexjoverm](https://twitter.com/alexjoverm)