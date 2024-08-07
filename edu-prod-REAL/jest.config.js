module.exports = {
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
      '^.+\\.tsx?$': 'ts-jest',
      '^.+\\.jsx?$': 'babel-jest',
      '^.+\\.mjs$': 'babel-jest'
  },
  transformIgnorePatterns: [
      '/node_modules/(?!axios|preact|@fullcalendar)'
  ]
};
