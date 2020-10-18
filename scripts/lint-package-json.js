/**
 * Check, if all npm dependencies has been installed with --exact flag.
 * BAD: yarn add [--dev] <dependency> (missing --exact flag)
 * GOOD: yarn add --exact [--dev] <dependency>
 */
const chalk = require("chalk");

const packageJson = require("../package.json");

const allDependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
  ...packageJson.peerDependencies,
  ...packageJson.optionalDependencies,
};

const unlockedDependencies = [];

Object.entries(allDependencies).forEach(([dependency, version]) => {
  if (/^[<>^~]/.test(version) || version === "*") {
    unlockedDependencies.push([dependency, version]);
  }
});

if (unlockedDependencies.length > 0) {
  process.stderr.write(
    chalk.red(`[lint-package.json] All dependencies must be installed with --exact flag.\n`),
  );
  process.stderr.write(
    chalk.red.bold(`[lint-package.json] Found some dependencies with unlocked version:\n`),
  );

  for (const [dependency, version] of unlockedDependencies) {
    process.stderr.write(chalk.red(`  > ${dependency}: ${version}\n`));
  }

  process.exit(1);
}
