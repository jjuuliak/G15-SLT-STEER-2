module.exports = {
  testEnvironment: "jsdom", // Use jsdom for React components
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest", // Ensures Jest properly transpiles ESM
  },
  transformIgnorePatterns: [
    "/node_modules/(?!react-markdown|remark-gfm|react-syntax-highlighter)" // Ensures these modules are transpiled
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "react-syntax-highlighter/dist/esm/styles/prism": "identity-obj-proxy",
    "react-markdown": "<rootDir>/__mocks__/react-markdown.js",
    "remark-gfm": "<rootDir>/__mocks__/remark-gfm.js",
    "react-syntax-highlighter": "<rootDir>/__mocks__/react-syntax-highlighter.js",
  },
  globals: {
    "babel-jest": {
      diagnostics: false // Disable Babel diagnostics that might cause false warnings
    }
  }
};
