module.exports = {
  extends: ["./eslint-base.js"],
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: [".eslintrc.js", "dist/**/*"],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off"
  }
};