// jest.config.js
module.exports = {
    transform: {
      "^.+\\.jsx?$": "babel-jest",
    },
    transformIgnorePatterns: [
      "/node_modules/(?!(axios)/)", // Adjust this pattern to include other necessary modules
    ],
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    testEnvironment: "jsdom",
  };
  