import enTranslations from '../../../public/locales/en/translations.json';
import moment from 'moment';
const language = 'English';
const waitTime = 2000;
let translation;
if (language === 'English') {
  translation = enTranslations;
}

const startDate = moment().utc().subtract(7, 'days').format('YYYY-MM-DD');
const endDate = moment().utc().format('YYYY-MM-DD');

context('REACT SKELETON', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8090/');
  });

  const validateShiftLogDataTable = () => {
    cy.wait(waitTime);
    cy.get('body').then((ele) => {
      if (ele.find('[data-testid="sltHistoryTable"]').length > 0) {
        cy.get('[data-testid="sltHistoryTable"]').should('be.visible');
        cy.get('[data-testid="sltHistoryTable"]')
          .get('[data-field="shift_id"]')
          .contains(translation.label.shiftId);
        cy.get('[data-testid="sltHistoryTable"]')
          .get('[data-field="shift_start"]')
          .contains(translation.label.shiftStart);
        cy.get('[data-testid="sltHistoryTable"]')
          .get('[data-field="shift_end"]')
          .contains(translation.label.shiftEnd);
        cy.get('[data-testid="sltHistoryTable"]')
          .get('[data-field="operator_name"]')
          .contains(translation.label.operatorName);
      }
    });
  };

  const validateLogDataTable = () => {
    cy.wait(waitTime);
    cy.get('body').then((element) => {
      if (element.find('[data-testid="sltLogTableView"]').length > 0) {
        cy.get('[data-testid="sltLogTableView"]').should('be.visible');
        cy.get('[data-testid="sltLogTableView"]')
          .get('[data-field="source"]')
          .contains(translation.label.source);
        cy.get('[data-testid="sltLogTableView"]')
          .get('[data-field="info"]')
          .contains(translation.label.info);
        cy.get('[data-testid="sltLogTableView"]')
          .get('[data-field="currentStatus"]')
          .contains(translation.label.currentStatus);
        cy.get('[data-testid="sltLogTableView"]')
          .get('[data-field="logTime"]')
          .contains(translation.label.logTime);
      }
    });
  };

  const validateShiftLogView = () => {
    cy.wait(waitTime);
    cy.get('[data-testid="content"]').then((ele) => {
      if (ele.find('[data-testid="sltHistoryTable"]').length > 0) {
        cy.get('[data-testid="sltHistoryTable"]').should('be.visible');
        cy.get('[data-testid="sltHistoryTable"]')
          .get('[data-field="shift_id"]')
          .contains(translation.label.shiftId);
        cy.get('[data-testid="sltHistoryTable"]')
          .get('[data-field="shift_start"]')
          .contains(translation.label.shiftStart);
        cy.get('[data-testid="sltHistoryTable"]')
          .get('[data-field="shift_end"]')
          .contains(translation.label.shiftEnd);
        cy.get('[data-testid="sltHistoryTable"]')
          .get('[data-field="operator_name"]')
          .contains(translation.label.operatorName);
        cy.get('#shiftId').click();
        cy.get('#viewHistoryTitle').contains(translation.label.viewHistoryTitle);
        cy.get('#shiftStart').contains(translation.label.shiftStart);
        cy.get('#shiftEnd').contains(translation.label.shiftEnd);
        cy.get('#operatorName').contains(translation.label.operatorName);
        cy.get('#shiftIDlable').contains(translation.label.shiftId);
        cy.get('#viewImages').contains(translation.label.viewImages);
        cy.get('#viewLogDataIDLabel').contains(translation.label.viewLogDataIDLabel);
        cy.get('#annotation').should('be.visible');
        cy.get('#comments').should('be.visible');
        validateLogDataTable();
      }
    });
  };
  it('Header : Verify external link to skao site', () => {
    cy.get('[data-testid="skaoLogo"]').click();
  });

  it('Header : Verify light/dark mode is available', () => {
    cy.get('[data-testid="Brightness7Icon"]').click();
    cy.get('[data-testid="Brightness4Icon"]').should('be.visible');
    cy.get('[data-testid="Brightness4Icon"]').click();
    cy.get('[data-testid="Brightness7Icon"]').should('be.visible');
  });

  it('Content : Verify shift log history list', () => {
    cy.get('[data-testid="historyButton"]').click();
    cy.get('[data-testid="logHistoryLabel"]').contains(translation.label.logHistoryTitle);
    cy.get('[data-testid="logButton"]').contains(translation.label.logButton);
    cy.get('[data-testid="dateEntryStart"]').type(startDate);
    cy.get('[data-testid="dateEntryEnd"]').type(endDate);
    cy.get('[data-testid="logHistorySearch"]').click();
    validateShiftLogDataTable();
  });

  it('Content : Verify shift log history view', () => {
    cy.get('[data-testid="historyButton"]').click();
    cy.get('[data-testid="logHistoryLabel"]').contains(translation.label.logHistoryTitle);
    cy.get('[data-testid="logButton"]').contains(translation.label.logButton);
    cy.get('[data-testid="dateEntryStart"]').type(startDate);
    cy.get('[data-testid="dateEntryEnd"]').type(endDate);
    cy.get('[data-testid="logHistorySearch"]').click();
    validateShiftLogView();
  });

  it('Content : Verify running shift log flow', () => {
    cy.get('[data-testid="manageShift"]').contains(translation.label.manageShift);
    cy.get('[data-testid="historyButton"]').contains(translation.label.history);
    cy.get('[data-testid="operatorNameId"]').click();
    cy.contains('DefaultUser').click({ force: true });
    cy.get('[data-testid="shiftStart"]').contains(translation.label.shiftStart);
    cy.get('[data-testid="shiftStartButton"]').click();
    cy.get('[data-testid="successStatusMsg"]').contains(translation.msg.shiftStarted);
    cy.get('[data-testid="shiftEnd"]').contains(translation.label.shiftEnd);
    cy.get('[data-testid="addComment"]').contains(translation.label.addComment);
    cy.get('[data-testid="addImages"]').contains(translation.label.addImages);
    cy.get('[data-testid="viewImages"]').contains(translation.label.viewImages);
    cy.get('[data-testid="operatorComment"]').type('This is test comment by operator');
    cy.get('[data-testid="commentButton"]').click();
    cy.get('[data-testid="successStatusMsg"]').contains(translation.msg.commentSubmit);
    validateShiftLogDataTable();
    cy.get('[data-testid="shiftEndButton"]').click();
    cy.get('[data-testid="successStatusMsg"]').contains(translation.msg.shiftEnd);
  });
});
