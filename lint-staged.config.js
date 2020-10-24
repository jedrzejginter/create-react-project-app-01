// eslint-disable-next-line import/no-extraneous-dependencies
const { CLIEngine } = require("eslint");

const cli = new CLIEngine({});

// Filter out files that should be omitted by lint-staged.
function filterFiles(filenames) {
  return filenames
    .filter((file) => !cli.isPathIgnored(file))
    .map((f) => `"${f}"`)
    .join(" ");
}

module.exports = {
  // Written as function, because this is how we can skip passing filenames
  // to the command.
  "package.json": () => "yarn lint-package-json",

  // Format JSON and markdown files.
  "*.{json,md}": (filenames) => `prettier --write ${filterFiles(filenames)}`,

  // It's important not to use "yarn lint", because it will lint whole
  // project anyway, so lint-staged wouldn't make any sense.
  "*.{ts,tsx,js,jsx}": (filenames) => `yarn eslint --fix ${filterFiles(filenames)}`,
};
