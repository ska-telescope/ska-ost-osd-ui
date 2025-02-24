Running / Building the Application
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Scripts for running, testing, and building the application are provided as part of the standard configuration. These are run using YARN and listed in the scripts section of the package.json file.

From the project directory, you can run any of the following:

- `> yarn dev`

  Runs the app in the development mode at [http://localhost:8090](http://localhost:8090). The app will recompile and restart if you make any edits to the source files. Any linting errors will also be shown in the console.

- `> yarn skao:update`

  yarn will update the repository with the latest SKAO libraries

- `> yarn start`

  Same as `yarn dev` but for some implementations it is prefixed with NODE_ENV=testing. This is used in the CI/CD Processes

- `> yarn cypress`

  Launches Cypress which has been set up to provide component testing. For further information on the use of Cypress, see https://docs.cypress.io/guides/component-testing/overview

- `> yarn test`

  Launches the test runner in the interactive watch mode. See the [testing](#testing) section for more information.

- `> yarn build`

  Builds the app for production to the `build` folder. The build is minified and any JSX is transpiled to JavaScript. Your app is ready to be deployed!

- `> yarn audit`

  Checks the dependencies to see if there are any vulnerabilities.  
