module.exports = {
    transform: {
      "^.+\\.[tj]sx?$": "babel-jest",
    },
    transformIgnorePatterns: [
      "/node_modules/(?!(axios)/)",
    ],
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    testEnvironment: "jsdom",
    extensionsToTreatAsEsm: [".ts", ".tsx", ".js", ".jsx"],
    globals: {
      'ts-jest': {
        useESM: true,
      },
    },
  };
  