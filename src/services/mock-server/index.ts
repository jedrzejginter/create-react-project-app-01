/* eslint-disable */

// @ts-ignore
typeof window === "undefined"
  ? require("./server").default.listen()
  : require("./browser").default.start();
