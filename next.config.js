const envalid = require("envalid");

const { compose, filterEnv, identity } = require("./utils");

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

let envSpec = {
  ANALYZE: envalid.bool({ default: false }),
  API_URL: envalid.url(),
};

if (IS_DEVELOPMENT) {
  envSpec = {
    ...envSpec,
    DEFAULT_USER_EMAIL: envalid.str({ default: "" }),
    DEFAULT_USER_PASSWORD: envalid.str({ default: "" }),
  };
}

// Validate env variables after we added some of them based on currect environment.
// From now, use "env" instead of "process.env" in this file.
const env = envalid.cleanEnv(process.env, envSpec);

// Fallback for bundle-analyzer if we decide not to use it.
let withBundleAnalyzer = identity;

// It's important to require bundle analyzer inside if statement,
// because we won't install this via yarn for production build
// to optimize side of node_modules inside docker image.
if (env.ANALYZE) {
  /* eslint-disable global-require */
  const bundleAnalyzer = require("@next/bundle-analyzer");
  /* eslint-enable global-require */

  withBundleAnalyzer = bundleAnalyzer({ enabled: true });
}

module.exports = compose([withBundleAnalyzer])({
  // Populate process.env with our environment variables.
  env: filterEnv(env),

  // We don't benefit from exposing that our app is running Next.js
  // so why not to hide this information.
  poweredByHeader: false,

  // React's Strict Mode is a development mode only feature for highlighting potential problems
  // in an application. It helps to identify unsafe lifecycles, legacy API usage, and a number
  // of other features.
  reactStrictMode: true,

  // Custom webpack config.
  webpack: (config) => {
    return config;
  },
});
