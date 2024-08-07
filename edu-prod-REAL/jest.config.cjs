module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(axios|preact)/)"
  ],
  moduleNameMapper: {
    "^axios$": require.resolve('axios'),
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
