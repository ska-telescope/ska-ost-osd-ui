import enTranslations from '../../../../public/locales/en/translations.json';

const language = 'English';
const waitTime = 2000;

let translation;

if (language === 'English') {
  translation = enTranslations;
}

export const CheckManageShiftPresentOrNot = () => {
  cy.get('[data-testid="manageShift"]').contains(translation.label.manageShift);
};

export const CheckHistoryButtonPresentOrNot = () => {
  cy.get('[data-testid="historyButton"]').contains(translation.label.history);
};

export const SelectOperatorName = () => {
  cy.get('[data-testid="operatorName"]').click({ force: true });
  cy.get('[data-testid="operatorName"]').type('DefaultUser');
};

export const PressShiftStartButton = () => {
  cy.get('[data-testid="shiftStartButton"]').contains(translation.label.shiftStart);
  cy.get('[data-testid="shiftStartButton"]').click({ force: true });
};

export const PressConfirmationDialog = () => {
  cy.get('[data-testid="confirmationDialogYes"]').contains(translation.label.YES);
  cy.get('[data-testid="confirmationDialogYes"]').click({ force: true });
};

export const ClickAddShiftComment = () => {
  cy.get('[data-testid="addShiftComments"]').contains(translation.label.addShiftComments);
  cy.get('[data-testid="addShiftComments"]').click({ force: true });
};

export const AddShiftComment = () => {
  cy.get('[data-testid="addShiftCommentTitle"]').contains(translation.label.addCommentsAndImages);
  cy.get('[data-testid="addShiftComment"]').contains(translation.label.addShiftComments);

  cy.get('[data-testid="operatorShiftComment"]').type('This is test shift comment by operator');
  cy.get('[data-testid="shiftCommentButton"]').contains(translation.label.add);
  cy.get('[data-testid="shiftCommentButton"]').click({ force: true });
  cy.get('[data-testid="shiftCommentModalClose"]').contains(translation.label.close);
  cy.get('[data-testid="shiftCommentModalClose"]').click({ force: true });
  cy.wait(waitTime);
};
