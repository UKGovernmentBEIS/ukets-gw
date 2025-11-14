const { defaultTransformerOptions } = require("jest-preset-angular/presets");

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "jest-preset-angular",
  cacheDirectory: "tmp/jest/cache",
  moduleNameMapper: {
    "^@etsgw/govuk-components":
      "<rootDir>/dist/govuk-components/esm2022/public-api.mjs",
    "^@etsgw/api": "<rootDir>/dist/etsgw-api/esm2022/",
    "^@etsgw/common/(.*)$": "<rootDir>/src/app/common/$1",
    "^@etsgw/core/(.*)": "<rootDir>/src/app/core/$1",
    "^@shared/(.*)": "<rootDir>/src/app/shared/$1",
    "^@error/(.*)": "<rootDir>/src/app/error/$1",
    "^lodash-es$": "lodash",
  },
  modulePathIgnorePatterns: ["<rootDir>/dist"],
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  moduleFileExtensions: ["ts", "html", "js", "json", "mjs"],
  transformIgnorePatterns: ["node_modules/(?!.*\\.mjs$)"],
  transform: {
    "^.+\\.(ts|js|mjs|html|svg)$": [
      "jest-preset-angular",
      {
        ...defaultTransformerOptions,
        isolatedModules: true,
      },
    ],
  },
};
