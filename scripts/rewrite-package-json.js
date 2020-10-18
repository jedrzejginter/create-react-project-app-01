const fs = require("fs");

function filterDependencies(oldDependencies, shouldBeRemoved) {
  const newDependencies = {};

  for (const dependencyName in oldDependencies) {
    if (!shouldBeRemoved(dependencyName)) {
      newDependencies[dependencyName] = oldDependencies[dependencyName];
    }
  }

  return newDependencies;
}

// We cannot just remove devDependencies,
// because we still need "@types/.." for transpilation.
function checkIfShouldBeRemoved(dependencyName) {
  return (
    /^(eslint|@typescript-eslint\/|@testing-library\/)/.test(dependencyName) ||
    ["@next/bundle-analyzer", "husky", "jest", "lint-staged", "prettier"].includes(dependencyName)
  );
}

const packageJson = require("../package.json");

packageJson.dependencies = filterDependencies(packageJson.dependencies, checkIfShouldBeRemoved);
packageJson.devDependencies = filterDependencies(
  packageJson.devDependencies,
  checkIfShouldBeRemoved,
);

// This will be saved in directory the script is run from.
fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2), "utf-8");
