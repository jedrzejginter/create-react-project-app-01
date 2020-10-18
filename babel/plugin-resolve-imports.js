const path = require("path");

const SRC_DIR = path.join(__dirname, "../src");

// This plugin resolves custom aliases to relative imports.
module.exports = () => {
  return {
    name: "babel-plugin-resolve-imports",
    visitor: {
      ImportDeclaration(importPath) {
        const importSource = importPath.node.source.value;

        // Run this only for our, internal imports that use custom alias..
        if (importSource.startsWith("@/")) {
          // Resolve alias to relative import.
          // "@/components/Button" -> "/path/to/src/components/Button"
          importPath.node.source.value = importSource.replace("@/", `${SRC_DIR}/`);
        }
      },
    },
  };
};
