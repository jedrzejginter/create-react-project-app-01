const path = require("path");

const [OFF, , ERROR] = [0, 1, 2];

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    project: "tsconfig.eslint.json",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    "airbnb-typescript",
    "prettier",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
    "prettier/react",
    "prettier/@typescript-eslint",
  ],
  plugins: ["jest", "@typescript-eslint"],
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  globals: {
    JSX: "readonly",
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      alias: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        map: [["@", path.join(__dirname, "src")]],
      },
    },
  },
  overrides: [
    {
      files: ["next.config.js", "scripts/*.js"],
      rules: {
        "import/no-extraneous-dependencies": [
          ERROR,
          {
            devDependencies: ["next.config.js", "scripts/*.js"],
          },
        ],
      },
    },
  ],
  rules: {
    "@typescript-eslint/camelcase": OFF,
    "consistent-return": OFF,
    "default-case": OFF,
    "import/order": [
      ERROR,
      {
        "newlines-between": "always",
        groups: [["external", "builtin"], "internal", "parent", ["index", "sibling"], "object"],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        pathGroups: [
          {
            pattern: "@/**",
            group: "internal",
          },
        ],
      },
    ],
    "import/prefer-default-export": OFF,
    "jsx-a11y/anchor-is-valid": OFF,
    "jsx-a11y/click-events-have-key-events": OFF,
    "jsx-a11y/label-has-associated-control": OFF,
    "jsx-a11y/no-noninteractive-element-interactions": OFF,
    "jsx-a11y/no-noninteractive-tabindex": OFF,
    "jsx-a11y/no-static-element-interactions": OFF,
    "no-nested-ternary": OFF,
    "no-param-reassign": OFF,
    "no-plusplus": OFF,
    "no-restricted-globals": OFF,
    "no-restricted-syntax": OFF,
    "no-underscore-dangle": OFF,
    "prettier/prettier": ERROR,
    "react/destructuring-assignment": OFF,
    "react/jsx-one-expression-per-line": OFF,
    "react/jsx-props-no-spreading": OFF,
    "react/no-array-index-key": OFF,
    "react/no-danger": OFF,
    "react/no-unescaped-entities": OFF,
    "react/prop-types": OFF,
    "react/react-in-jsx-scope": OFF,
    "react/require-default-props": OFF,
    "react/state-in-constructor": OFF,
    "react/static-property-placement": OFF,
    "react-hooks/exhaustive-deps": ERROR,
    "symbol-description": OFF,
  },
};
