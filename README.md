# TypeScript library starter

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Greenkeeper badge](https://badges.greenkeeper.io/alexjoverm/typescript-library-starter.svg)](https://greenkeeper.io/)
[![Travis](https://img.shields.io/travis/alexjoverm/typescript-library-starter.svg)](https://travis-ci.org/alexjoverm/typescript-library-starter)
[![Coveralls](https://img.shields.io/coveralls/alexjoverm/typescript-library-starter.svg)](https://coveralls.io/github/alexjoverm/typescript-library-starter)
[![Dev Dependencies](https://david-dm.org/alexjoverm/typescript-library-starter/dev-status.svg)](https://david-dm.org/alexjoverm/typescript-library-starter?type=dev)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://paypal.me/AJoverMorales)

A starter project that makes creating a TypeScript library extremely easy.

![](https://i.imgur.com/opUmHp0.png)

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
 - **[RollupJS](https://rollupjs.org/)** for multiple optimized bundles following the [standard convention](http://2ality.com/2017/04/setting-up-multi-platform-packages.html) and [Tree-shaking](https://alexjoverm.github.io/2017/03/06/Tree-shaking-with-Webpack-2-TypeScript-and-Babel/).
 - Tests, coverage and interactive watch mode using **[Jest](http://facebook.github.io/jest/)**
 - **[Prettier](https://github.com/prettier/prettier)** and **[TSLint](https://palantir.github.io/tslint/)** for code formatting and consistency.
 - **Docs automatic generation and deployment** to `gh-pages`, using **[TypeDoc](http://typedoc.org/)**
 - Automatic types `(*.d.ts)` file generation
 - **[Travis](https://travis-ci.org)** integration and **[Coveralls](https://coveralls.io/)** report
 - (Optional) **Automatic releases and changelog**, using [Semantic release](https://github.com/semantic-release/semantic-release), [Commitizen](https://github.com/commitizen/cz-cli), [Conventional changelog](https://github.com/conventional-changelog/conventional-changelog) and [Husky](https://github.com/typicode/husky) (for the git hooks)

### Excluding peerDependencies

On library development, one might want to set some peer dependencies, and thus remove those from the final bundle. You can see in [Rollup docs](https://rollupjs.org/#peer-dependencies) how to do that.

The good news is that you only need to include the dependency name in the `external` property within `rollup.config.js`. For example, if you wanna exclude `lodash`, just write `external: ['lodash']`.

### NPM scripts

 - `npm t`: Run test suite
 - `npm start`: Runs `npm run build` in watch mode
 - `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
 - `npm run test:prod`: Run linting and generate coverage
 - `npm run build`: Generate bundles and typings, create docs
 - `npm run lint`: Lints code
 - `npm run commit`: Commit using conventional commit style ([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:)

### Automatic releases

If you'd like to have automatic releases with Semantic Versioning, follow these simple steps.

_**Prerequisites**: you need to create/login accounts and add your project to:_
 - npm
 - Travis
 - Coveralls

Run the following command to prepare hooks and stuff:

```bash
npm run semantic-release-prepare
```

Follow the console instructions to install semantic release and run it (answer NO to "Generate travis.yml").

_Note: make sure you've setup `repository.url` in your `package.json` file_

```bash
npm install -g semantic-release-cli
semantic-release setup
# IMPORTANT!! Answer NO to "Generate travis.yml" question. It is already prepared for you :P
```

From now on, you'll need to use `npm run commit`, which is a convenient way to create conventional commits.

Automatic releases are possible thanks to [semantic release](https://github.com/semantic-release/semantic-release), which publishes your code automatically on Github and npm, plus generates a changelog automatically. This setup is highly influenced by [Kent C. Dodds course on egghead.io](https://egghead.io/courses/how-to-write-an-open-source-javascript-library)

### Git Hooks

There is already set a `precommit` hook for formatting your code with Prettier :nail_care:

By default, there are two disabled git hooks. They're set up when you run the `npm run semantic-release-prepare` script. They make sure:
 - You follow a [conventional commit message](https://github.com/conventional-changelog/conventional-changelog)
 - Your build is not gonna fail in [Travis](https://travis-ci.org) (or your CI server), since it's being run locally before `git push`

This makes more sense in combination with [automatic releases](#automatic-releases)

### FAQ

#### `Array.prototype.from`, `Promise`, `Map`... is undefined?

TypeScript or Babel only provides down-emits on syntactical features (`class`, `let`, `async/await`...), but not on functional features (`Array.prototype.find`, `Set`, `Promise`...), . For that, you need Polyfills, such as [`core-js`](https://github.com/zloirock/core-js) or [`babel-polyfill`](https://babeljs.io/docs/usage/polyfill/) (which extends `core-js`).

For a library, `core-js` plays very nicely, since you can import just the polyfills you need:

```javascript
import "core-js/fn/array/find"
import "core-js/fn/string/includes"
import "core-js/fn/promise"
...
```

#### What is `npm install` doing when I run it for the first time?

It runs the script `tools/init` which sets up everything for you. In short, it:
 - Configures RollupJS for the build, which creates the bundles.
 - Configures `package.json` (typings file, main file, etc)
 - Renames main src and test files

#### What if I don't want git-hooks, automatic releases or semantic-release?

Then you may want to:
 - Remove `commitmsg`, `postinstall` scripts from `package.json`. That will not use those git hooks to make sure you make a conventional commit
 - Remove `npm run semantic-release` from `.travis.yml`

#### What if I don't want to use coveralls or report my coverage?

Remove `npm run report-coverage` from `.travis.yml`

## Resources

- [Write a library using TypeScript library starter](https://dev.to/alexjoverm/write-a-library-using-typescript-library-starter) by [@alexjoverm](https://github.com/alexjoverm/)
- [📺 Create a TypeScript Library using typescript-library-starter](https://egghead.io/lessons/typescript-create-a-typescript-library-using-typescript-library-starter) by [@alexjoverm](https://github.com/alexjoverm/)
- [Introducing TypeScript Library Starter Lite](https://blog.tonysneed.com/2017/09/15/introducing-typescript-library-starter-lite/) by [@tonysneed](https://github.com/tonysneed)

## Credits

Made with :heart: by [@alexjoverm](https://twitter.com/alexjoverm) and all these wonderful contributors ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/6052309?v=3" width="100px;"/><br /><sub>Ciro</sub>](https://www.linkedin.com/in/ciro-ivan-agulló-guarinos-42109376)<br />[💻](https://github.com/alexjoverm/typescript-library-starter/commits?author=k1r0s "Code") [🔧](#tool-k1r0s "Tools") | [<img src="https://avatars.githubusercontent.com/u/947523?v=3" width="100px;"/><br /><sub>Marius Schulz</sub>](https://blog.mariusschulz.com)<br />[📖](https://github.com/alexjoverm/typescript-library-starter/commits?author=mariusschulz "Documentation") | [<img src="https://avatars.githubusercontent.com/u/4152819?v=3" width="100px;"/><br /><sub>Alexander Odell</sub>](https://github.com/alextrastero)<br />[📖](https://github.com/alexjoverm/typescript-library-starter/commits?author=alextrastero "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/8728882?v=3" width="100px;"/><br /><sub>Ryan Ham</sub>](https://github.com/superamadeus)<br />[💻](https://github.com/alexjoverm/typescript-library-starter/commits?author=superamadeus "Code") | [<img src="https://avatars1.githubusercontent.com/u/8458838?v=3" width="100px;"/><br /><sub>Chi</sub>](https://consiiii.me)<br />[💻](https://github.com/alexjoverm/typescript-library-starter/commits?author=ChinW "Code") [🔧](#tool-ChinW "Tools") [📖](https://github.com/alexjoverm/typescript-library-starter/commits?author=ChinW "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/2856501?v=3" width="100px;"/><br /><sub>Matt Mazzola</sub>](https://github.com/mattmazzola)<br />[💻](https://github.com/alexjoverm/typescript-library-starter/commits?author=mattmazzola "Code") [🔧](#tool-mattmazzola "Tools") | [<img src="https://avatars0.githubusercontent.com/u/2664047?v=3" width="100px;"/><br /><sub>Sergii Lischuk</sub>](http://leefrost.github.io)<br />[💻](https://github.com/alexjoverm/typescript-library-starter/commits?author=Leefrost "Code") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars1.githubusercontent.com/u/618922?v=3" width="100px;"/><br /><sub>Steve Lee</sub>](http;//opendirective.com)<br />[🔧](#tool-SteveALee "Tools") | [<img src="https://avatars0.githubusercontent.com/u/5127501?v=3" width="100px;"/><br /><sub>Flavio Corpa</sub>](http://flaviocorpa.com)<br />[💻](https://github.com/alexjoverm/typescript-library-starter/commits?author=kutyel "Code") | [<img src="https://avatars2.githubusercontent.com/u/22561997?v=3" width="100px;"/><br /><sub>Dom</sub>](https://github.com/foreggs)<br />[🔧](#tool-foreggs "Tools") | [<img src="https://avatars1.githubusercontent.com/u/755?v=4" width="100px;"/><br /><sub>Alex Coles</sub>](http://alexbcoles.com)<br />[📖](https://github.com/alexjoverm/typescript-library-starter/commits?author=myabc "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/1093738?v=4" width="100px;"/><br /><sub>David Khourshid</sub>](https://github.com/davidkpiano)<br />[🔧](#tool-davidkpiano "Tools") | [<img src="https://avatars0.githubusercontent.com/u/7225802?v=4" width="100px;"/><br /><sub>Aarón García Hervás</sub>](https://aarongarciah.com)<br />[📖](https://github.com/alexjoverm/typescript-library-starter/commits?author=aarongarciah "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/13683986?v=4" width="100px;"/><br /><sub>Jonathan Hart</sub>](https://www.stuajnht.co.uk)<br />[💻](https://github.com/alexjoverm/typescript-library-starter/commits?author=stuajnht "Code") |
| [<img src="https://avatars1.githubusercontent.com/u/32557482?v=4" width="100px;"/><br /><sub>kid-sk</sub>](https://github.com/kid-sk)<br />[📖](https://github.com/alexjoverm/typescript-library-starter/commits?author=kid-sk "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/1503089?v=4" width="100px;"/><br /><sub>Andrea Gottardi</sub>](http://about.me/andreagot)<br />[📖](https://github.com/alexjoverm/typescript-library-starter/commits?author=AndreaGot "Documentation") |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind are welcome!
