import { openSync } from "fs";

const { echo, touch, cd } = require('shelljs')
const { readFileSync } = require('fs')
const path = require('path')
const gitUrlParse = require('git-url-parse');
const ghpages = require('gh-pages');

const fileFolderExists = (filePath: string) => {
  try {
    openSync(filePath, 'r');
    return true;
  } catch {
    return false;
  }
}

(async () => {

  if (!fileFolderExists(path.resolve(__dirname, '../docs'))) {
    throw new Error('`./docs` directory is missing')
  }

  /**
   * GH_TOKEN - Used for publishing the GitHub release
   * and creating labels (needs repo permission).
   */
  if (!('GH_TOKEN' in process.env)) {
    throw new Error('Environment variable `GH_TOKEN` is missing but required')
  }

  const REGEX_GIT_URL = '^([A-Za-z0-9]+@|http(|s)\\:\\/\\/)([A-Za-z0-9.]+(:\\d+)?)(?::|\\/)([\\d\\/\\w.-]+?\\.git)?$';
  const pkg = JSON.parse(readFileSync(path.resolve(__dirname, '../package.json')) as any)

  let repoUrl
  if (Object.prototype.toString.call(pkg.repository) === '[object Object]') {
    if (!('url' in pkg.repository)) {
      throw new Error('URL does not exist in repository section')
    }
    repoUrl = pkg.repository.url
  } else {
    repoUrl = pkg.repository
  }

  /**
   * Validate Repository URL against regular expression
   */
  if (!new RegExp(REGEX_GIT_URL, 'i').test(repoUrl)) {
    throw new Error(`RepoUrl '${repoUrl}' is invalid`)
  }

  const { resource, pathname } = gitUrlParse(repoUrl)
  const repo = `https://${process.env.GH_TOKEN}@${resource}${pathname}`

  echo('Deploying docs!!!')

  // cd('./docs')
  // touch('.nojekyll')
  //
  // ghpages.publish('dist', {
  //     add: true,
  //     init: true,
  //     force: true,
  //     quiet: true,
  //     branch: 'master:gh-pages',
  //     repo,
  //     // dest: 'static/project',
  //     message: 'docs(docs): update gh-pages',
  //   }, (err: Error) => {
  //     if (err) {
  //       throw err
  //     }
  //   });

})().catch(err => {
  console.error(err)
  process.exit(1)
});
