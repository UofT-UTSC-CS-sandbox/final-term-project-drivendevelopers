module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
    "^.+\\.mjs$": "babel-jest", // Add this line to transform .mjs files
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
  extensionsToTreatAsEsm: [".ts", ".tsx", ".mjs"], // Add .mjs here
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"]
};
