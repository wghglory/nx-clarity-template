/* eslint-disable */
export default {
  displayName: 'shared-modules',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  coverageReporters: ['lcov', 'json', 'text-summary'],
  collectCoverage: true,
  coverageDirectory: '../../../coverage/libs/shared/modules',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
  },
  moduleNameMapper: {
    '@cds/core/icon/(.*)$': '<rootDir>/../../../node_modules/@cds/core/icon/index.js',
  },
  transformIgnorePatterns: ['node_modules/(?!(@cds|@lit|lit|ramda|.*\\.mjs$))'], // ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
