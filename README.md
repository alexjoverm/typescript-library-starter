# Typescript library starter

Write your docs here

Features:
 - **[Webpack]()** for building and bundling a UMD library
 - **[Jest]()** for painlessly run your test
 - **[TSLint]()** ([standard-config]()) for you code styling
 - **[Travis]()** integration and **[Coveralls]()** report
 - (Optional) **Automatic releases and changelog**, using [Semantic release](), [Commitizen](), [Conventional changelog]() and [Husky]() (for the hook)
 - **[TypeDoc]()** for generating docs, based on types and jsDocs
 - **Docs auto-deployment** to gh-pages using custom tools under `tools` directory
 - Automatic types generation
 - Editor config

### Usage

```bash
git clone https://github.com/alexjoverm/typescript-library-starter.git YOURFOLDERNAME
cd YOURFOLDERNAME
rm -Rf .git # Remove .git folder. Then link it to your repo

yarn install # or npm install

# Name your library and update the conf accordingly (this command will be removed after run it)
node tools/init
```

### Automatic releases

Prerequisites: you need to create/login accounts and add your project to:
 - Travis
 - Coveralls
 - NPM

```bash
yarn global add semantic-release-cli # or npm install -g semantic-release-cli
semantic-release setup
# IMPORTANT!! Answer NO to "Generate travis.yml" question. Is already prepared for you :P
```