// jest.config.cjs
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  rootDir: "./",
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: [
    "<rootDir>/src/**/*.tsx",
    "!<rootDir>/src/**/constant.tsx",
  ],
  testPathIgnorePatterns: ["<rootDir>/node_modules"],
  coverageReporters: ["json", "html"],
  testMatch: ["<rootDir>/src/**/*.spec.tsx"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/fileTransformer.cjs",
    ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform",
  },
};
