import enTranslations from '../../../../public/locales/en/translations.json';
const language = 'English';
let translation;
if (language === 'English') {
  translation = enTranslations;
}

describe('Creating Shift', () => {
  it('should create a new shift', { jiraKey: 'XTP-75132' }, () => {
    cy.get('[data-testid="manageShift"]').contains(translation.label.manageShift);
    cy.get('[data-testid="historyButton"]').contains(translation.label.history);
    cy.get('[data-testid="operatorName"]').click({ force: true });
    cy.get('[data-testid="operatorName"]').type('DefaultUser');
    cy.get('[data-testid="shiftStartButton"]').contains(translation.label.shiftStart);
    cy.get('[data-testid="shiftStartButton"]').click({ force: true });

    cy.get('body').then((element) => {
      if (
        element.find('[data-testid="confirmationDialog"]') &&
        element.find('[data-testid="confirmationDialog"]').length > 0
      ) {
        cy.get('[data-testid="confirmationDialogYes"]').contains(translation.label.YES);
        cy.get('[data-testid="confirmationDialogYes"]').click({ force: true });
      }
    });

    cy.get('[data-testid="addShiftComments"]').contains(translation.label.addShiftComments);
    cy.get('[data-testid="addShiftComments"]').click({ force: true });
  });
});
