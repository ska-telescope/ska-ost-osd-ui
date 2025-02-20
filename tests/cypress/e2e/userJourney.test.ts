// import enTranslations from '../../../public/locales/en/translations.json';
// const language = 'English';
// let translation;
// if (language === 'English') {
//   translation = enTranslations;
// }

// context('SKA OSD UI', () => {
//   beforeEach(() => {
//     cy.visit('http://localhost:8090/');
//   });

//   it('Header : Verify external link to skao site', () => {
//     cy.get('[data-testid="skaoLogo"]').click();
//   });

//   it('Header : Verify light/dark mode is available', () => {
//     cy.get('[data-testid="Brightness7Icon"]').click();
//     cy.get('[data-testid="Brightness4Icon"]').should('be.visible');
//     cy.get('[data-testid="Brightness4Icon"]').click();
//     cy.get('[data-testid="Brightness7Icon"]').should('be.visible');
//   });

//   it('Footer : Verify Title and Telescope selector', () => {
//     cy.get('[data-testid="footerId"]').contains('0.1.0').should('be.visible');
//   });
//   // Container testing

//   it('Content : verify title', () => {
//     cy.get('[data-testid="headerId"]').should('be.visible');
//   });
// });
