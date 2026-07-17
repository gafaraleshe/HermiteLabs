// Used by Jest (via babel-jest) to run the TypeScript logic tests without a
// separate ts-jest/tsconfig pipeline. Vite/esbuild handle the app build itself.
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
};
