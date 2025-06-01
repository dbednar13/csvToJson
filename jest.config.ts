import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  coverageReporters: [
    'clover',
    'html',
    'json',
    'lcov',
    ['text', { skipFull: true }],
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverage: true,
};
export default config;
