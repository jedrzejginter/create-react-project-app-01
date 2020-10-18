module.exports = (api) => {
  const presets = ["next/babel"];
  const plugins = [
    // Add support for import aliases ("@/...").
    "./babel/plugin-resolve-imports.js",

    // Allow importing SVG files.
    // import Icon from "@/assets/icons/icon.svg"
    // Icon will be a React component.
    "inline-react-svg",
  ];

  // Remove "data-testid" from components in production bundle.
  // We want to keep it for test environment, so test can query
  // component by this attribute.
  if (api.env("production") && !api.env("test")) {
    plugins.push("jsx-remove-data-test-id");
  }

  return { presets, plugins };
};
