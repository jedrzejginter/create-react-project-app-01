/**
 * Filter env variables for Next config.
 * @see: https://github.com/zeit/next.js/blob/master/errors/env-key-not-allowed.md
 */
module.exports.filterEnv = function filterEnv(allEnv) {
  const cleanEnv = {};

  for (const envName in allEnv) {
    if (!/^(__|NODE_)/.test(envName)) {
      cleanEnv[envName] = allEnv[envName];
    }
  }

  return cleanEnv;
};

/**
 * Function returning input value.
 */
module.exports.identity = function identity(v) {
  return v;
};

/**
 * Compose multiple functions into one to avoid "nesting hell".
 * `compose([f, g, h])(x)` is equivalent to `f(g(h(x)))`
 */
module.exports.compose = function compose(fns) {
  return (arg) => {
    return fns.reduceRight((acc, fn) => fn(acc), arg);
  };
};
