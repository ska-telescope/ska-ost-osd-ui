export const env = {
  ...window.env,
  ...(typeof Cypress !== 'undefined' ? Cypress.env() : {})
};
