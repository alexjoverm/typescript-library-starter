import { InitClass } from './init.class';

/**
 * This script runs automatically after your first npm-install.
 */
(async () => {
  const init = new InitClass()
  await init.initPrompts()
})().catch(err => {
  console.error(err);
  /**
   * Only Error instance objects end the script ungracefully (e.g., `process.exit(1)`)
   */
  process.exit(+(err instanceof Error));
});
