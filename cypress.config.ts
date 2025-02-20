/* eslint-disable global-require */
/* eslint-disable import/no-import-module-exports */
import { defineConfig } from 'cypress';

export default defineConfig({
  fixturesFolder: 'tests/cypress/fixtures',
  screenshotsFolder: 'tests/cypress/screenshots',
  videosFolder: 'tests/cypress/videos',
  downloadsFolder: 'tests/cypress/downloads',
  component: {
    supportFile: 'tests/cypress/support/component.js',
    specPattern: '**/*.test.{js,jsx,ts,tsx}',
    indexHtmlFile: 'tests/cypress/support/component-index.html',
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);
      on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'));
      return config;
    },
    excludeSpecPattern: 'tests/cypress/integration/**',
  },

  e2e: {
    baseUrl: 'http://localhost:8090',
    supportFile: 'tests/cypress/support/e2e.js',
    defaultCommandTimeout: 10000,
    reporter: 'cypress-xray-junit-reporter',
    reporterOptions: {
      mochaFile: './report/[suiteName].xml',
      useFullSuiteTitle: false,
      jenkinsMode: true,
      xrayMode: true, // if JiraKey are set correctly inside the test the XML report will contain the JiraKey value
      attachScreenshot: true, // if a test fails, the screenshot will be attached to the XML report and imported into xray
    },
    setupNodeEvents(on, config) {
      require('cypress-xray-junit-reporter/plugin')(on, config, {}); // also needed
      return config;
    },
    specPattern: 'tests/cypress/integration/**/*.test.tsx',
  },
});
