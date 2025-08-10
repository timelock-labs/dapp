module.exports = {
  // Line length and wrapping
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,

  // Semicolons and quotes
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',

  // Trailing commas and spacing
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,

  // Arrow functions and JSX
  arrowParens: 'avoid',
  jsxSingleQuote: true,

  // Line endings
  endOfLine: 'lf',

  // File-specific overrides
  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
    {
      files: '*.json',
      options: {
        printWidth: 180,
      },
    },
  ],
};
