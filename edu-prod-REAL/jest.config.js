module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios|preact|@fullcalendar)"
  ],
  moduleNameMapper: {
    "^axios$": require.resolve('axios'),
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^preact$": require.resolve('preact'),
    "^preact-render-to-string$": require.resolve('preact-render-to-string')
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  setupFiles: ["<rootDir>/src/setupTests.js"]
};
