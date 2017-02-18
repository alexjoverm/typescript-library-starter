# Typescript library starter

Write your docs here

Features:
 - **[Webpack](https://webpack.js.org/)** for building and bundling a UMD library
 - **[Jest](http://facebook.github.io/jest/)** for painlessly run your test
 - **[TSLint](https://palantir.github.io/tslint/)** ([standard-config](https://github.com/blakeembrey/tslint-config-standard)) for your code styling
 - **[Travis](https://travis-ci.org)** integration and **[Coveralls](https://coveralls.io/)** report
 - **[TypeDoc](http://typedoc.org/)** for generating docs, based on types and jsDocs
 - **Docs auto-deployment** to `gh-pages` using custom tools under `tools` directory
 - Automatic types generation
 - (Optional) **Automatic releases and changelog**, using [Semantic release](https://github.com/semantic-release/semantic-release), [Commitizen](https://github.com/commitizen/cz-cli), [Conventional changelog](https://github.com/conventional-changelog/conventional-changelog) and [Husky](https://github.com/typicode/husky) (for the git hooks)
 - Editor config

### Usage

```bash
git clone https://github.com/alexjoverm/typescript-library-starter.git YOURFOLDERNAME
cd YOURFOLDERNAME

# Run npm install and things will be setup!
npm install
```

### npm scripts

 - `npm t`: Run test suite
 - `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
 - `npm run test:prod`: Run linting + generate coverage
 - `npm run build`: Bundles code, create docs and generate typings
 - `npm run commit`: Commit using conventional commit style ([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:)

### GitHooks

By default, 2 githooks are **enabled** using [husky](https://github.com/typicode/husky). It's suggested to keep them, since they make sure:
 - You follow a [conventional commit message](https://github.com/conventional-changelog/conventional-changelog)
 - Your build is not gonna fail in [Travis](https://travis-ci.org) (or your CI server), since it's runned locally before `git push`

You **can disable** them. Read [FAQ section](#faq).

### Automatic releases

_**Prerequisites**_: you need to create/login accounts and add your project to:
 - Travis
 - Coveralls
 - NPM

```bash
npm install -g semantic-release-cli
semantic-release setup
# IMPORTANT!! Answer NO to "Generate travis.yml" question. Is already prepared for you :P
```

Automatic releases are possible thanks to [semantic release](https://github.com/semantic-release/semantic-release), which publish your code **automatically on github and npm**, plus generates **automatically a changelog**.

### FAQ

#### What if I don't want automatic releases or semantic-release?

Then you may want to:
 - Remove `commitmsg`, `postinstall` scripts from `package.json`. That will not use those git hooks to make sure you make a conventional commit
 - Remove `npm run semantic-release` from `.travis.yml`
