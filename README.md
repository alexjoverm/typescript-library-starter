# TypeScript library starter

A starter project that makes creating a TypeScript library extremely easy.

### Usage

```bash
git clone https://github.com/alexjoverm/typescript-library-starter.git YOURFOLDERNAME
cd YOURFOLDERNAME

# Run npm install and write your library name when asked. That's all!
npm install
```

**Start coding!** `package.json` and entry files are already set up for you, so don't worry about linking to your main file, typings, etc. Just keep those files with the same names.

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

If you'd like to have automatic releases with Semantic Versioning, follow these simple steps.

_**Prerequisites**: you need to create/login accounts and add your project to:_
 - npm
 - Travis
 - Coveralls

Set up the git hooks (see [Git hooks section](#git-hooks) for more info):

```bash
node tools/init-hooks
```

Install semantic release and run it (answer NO to "Generate travis.yml").

```bash
npm install -g semantic-release-cli
semantic-release setup
# IMPORTANT!! Answer NO to "Generate travis.yml" question. Is already prepared for you :P
```

From now on, you'll need to use `npm run commit`, which is a convenient way to create conventional commits.

Automatic releases are possible thanks to [semantic release](https://github.com/semantic-release/semantic-release), which publishes your code automatically on github and npm, plus generates automatically a changelog. This setup is highly influenced by [Kent C. Dodds course on egghead.io](https://egghead.io/courses/how-to-write-an-open-source-javascript-library)

### Git Hooks

By default, there are 2 disabled git hooks. You can enable them by running `node tools/init-hooks` (which uses [husky](https://github.com/typicode/husky)). They make sure:
 - You follow a [conventional commit message](https://github.com/conventional-changelog/conventional-changelog)
 - Your build is not gonna fail in [Travis](https://travis-ci.org) (or your CI server), since it's runned locally before `git push`


### FAQ

#### Why using TypeScript and Babel?

In most cases, you can compile TypeScript code to ES5, or even ES3. But in some cases, where you use "functional es2015+ features", such as `Array.prototype.find`, `Map`, `Set`... then you need to set `target` to "es6". This is by design, since TypeScript only provides down-emits on syntactical language features (such as `const`, `class`...), but Babel does. So it's setup up in a 2 steps build so you can use es2015+ features.

This should be transparent for you and you shouldn't even notice. But if don't need this, you can remove Babel from the build:
 - Set target to "es5" or "es3" in `tsconfig.json` and `tsconfig.prod.json`
 - Remove `babel-loader` from `webpack.config.ts`

More info in [https://github.com/Microsoft/TypeScript/issues/6945](https://github.com/Microsoft/TypeScript/issues/6945)

#### What if I don't want git-hooks, automatic releases or semantic-release?

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

Made with :heart: by [@alexjoverm](https://twitter.com/alexjoverm) and all these wonderful contributors ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/6052309?v=3" width="100px;"/><br /><sub>Ciro</sub>](https://www.linkedin.com/in/ciro-ivan-agulló-guarinos-42109376)<br />[💻](https://github.com/alexjoverm/typescript-library-starter/commits?author=k1r0s) 🔧 | [<img src="https://avatars.githubusercontent.com/u/947523?v=3" width="100px;"/><br /><sub>Marius Schulz</sub>](https://blog.mariusschulz.com)<br />[📖](https://github.com/alexjoverm/typescript-library-starter/commits?author=mariusschulz) | [<img src="https://avatars.githubusercontent.com/u/4152819?v=3" width="100px;"/><br /><sub>Alexander Odell</sub>](https://github.com/alextrastero)<br />[📖](https://github.com/alexjoverm/typescript-library-starter/commits?author=alextrastero) |
| :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
