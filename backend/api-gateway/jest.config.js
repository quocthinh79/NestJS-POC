module.exports = {
  // preset: '@nestjs/testing',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: false,
  coverageDirectory: './coverage',
  testPathIgnorePatterns: ['./node_modules/', './dist/'],
  coveragePathIgnorePatterns: ['<rootDir>/src/utils/configs/'],
};
