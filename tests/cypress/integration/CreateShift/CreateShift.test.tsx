import {
  CheckManageShiftPresentOrNot,
  CheckHistoryButtonPresentOrNot,
  SelectOperatorName,
  PressShiftStartButton,
  PressConfirmationDialog,
  ClickAddShiftComment,
  AddShiftComment,
} from '../common/common';

describe('Creating Shift', () => {
  it('should create a new shift', { jiraKey: 'XTP-75132' }, () => {
    CheckManageShiftPresentOrNot();
    CheckHistoryButtonPresentOrNot();
    SelectOperatorName();
    PressShiftStartButton();

    cy.get('body').then((element) => {
      if (
        element.find('[data-testid="confirmationDialog"]') &&
        element.find('[data-testid="confirmationDialog"]').length > 0
      ) {
        PressConfirmationDialog();
      }
    });

    ClickAddShiftComment();

    cy.get('body').then((element) => {
      if (
        element.find('[data-testid="addShiftCommentModal"]') &&
        element.find('[data-testid="addShiftCommentModal"]').length > 0
      ) {
        AddShiftComment;
      }
    });
  });
});
