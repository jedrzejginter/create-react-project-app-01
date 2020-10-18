module.exports = {
  // Written as function, because this is how we can skip passing filenames
  // to the command.
  "package.json": () => "yarn lint-package-json",

  // Format JSON and markdown files.
  "*.{json,md}": "prettier --write",

  // It's important not to use "yarn lint", because it will lint whole
  // project anyway, so lint-staged wouldn't make any sense.
  "*.{ts,tsx,js,jsx}": "yarn eslint --fix",
};
