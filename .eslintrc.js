module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "next/core-web-vitals",
    // "plugin:@next/next/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json"],
    tsconfigRootDir: __dirname,
  },
  plugins: ["no-relative-import-paths", "simple-import-sort"],
  rules: {
    "no-relative-import-paths/no-relative-import-paths": [
      "warn",
      { allowSameFolder: false, prefix: "@", rootDir: "src" },
    ],
    "simple-import-sort/imports": [
      "warn",
      {
        groups: [
          // External packages
          ["^@?\\w"],
          // Type imports
          ["^.*\\u0000$"],

          ["^@"],

          // Side effect imports
          ["^\\u0000"],

          // Style imports
          ["^.+\\.s?css$"],

          // Static assets
          ["^@/(static|assets)(/.*|$)"],
        ],
      },
    ],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-return": "off",
  },
};
