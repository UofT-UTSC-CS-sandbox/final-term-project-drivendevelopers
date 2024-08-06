module.exports = {
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest'
    },
    transformIgnorePatterns: [
      '/node_modules/'
    ],
    moduleNameMapper: {
      '\\.(css|less)$': 'identity-obj-proxy'
    },
    setupFilesAfterEnv: ['./jest.setup.js']
  };
  