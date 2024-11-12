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

context('Shift Log Tool', () => {
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
          .get('[data-field="sbiStatus"]')
          .contains(translation.label.sbiStatus);
        cy.get('[data-testid="sltLogTableView"]')
          .get('[data-field="logTime"]')
          .contains(translation.label.dateTime);
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

        cy.get('body').then((element) => {
          if (
            element.find('[data-testid="availableShiftData"]') &&
            element.find('[data-testid="availableShiftData"]').length > 0
          ) {
            if (
              element.find('[data-testid="shiftId1"]') &&
              element.find('[data-testid="shiftId1"]').length > 0
            ) {
              cy.get('[data-testid="shiftId1"]').click();
            }
            
          }
        });

        cy.get('[data-testid="viewHistoryTitle"]').should('be.visible');
        // cy.get('#').contains(translation.label.viewHistoryTitle);
        cy.get('#shiftStart').contains(translation.label.shiftStartedAt);
        cy.get('#shiftEnd').contains(translation.label.shiftEndsAt);
        cy.get('#operatorName').contains(translation.label.operatorName);
        cy.get('[data-testid="viewShiftCommentsHistory"]').contains(
          translation.label.viewShiftComments,
        );

        cy.get('body').then((element) => {
          if (
            element.find('[data-testid="viewShiftCommentsHistoryData"]') &&
            element.find('[data-testid="viewShiftCommentsHistoryData"]').length > 0
          ) {
            cy.get('[data-testid="commentedAtHistory"]').contains(translation.label.commentedAt);
            cy.get('[data-testid="viewShiftHistoryImagesHistory"]').should('be.visible');
            cy.get('[data-testid="shiftCommentsHistory"]').contains(translation.label.comments);
          }
        });

        cy.get('[data-testid="addAnnotationLabel"]').contains(translation.label.addAnnotationLabel);

        cy.get('[data-testid="addAnnotation"]').type('This is test shift annotation by operator');
        cy.get('[data-testid="addAnnotationBtn"]').contains(translation.label.add);
        cy.get('[data-testid="addAnnotationBtn"]').click({ force: true });
      }
    });
  };
  it('Header : Verify external link to skao site', () => {
    cy.get('[data-testid="skaoLogo"]').click();
  });

  // it('Header : Verify light/dark mode is available', () => {
  //   cy.get('[data-testid="Brightness7Icon"]').click();
  //   cy.get('[data-testid="Brightness4Icon"]').should('be.visible');
  //   cy.get('[data-testid="Brightness4Icon"]').click();
  //   cy.get('[data-testid="Brightness7Icon"]').should('be.visible');
  // });

  // it('Content : Verify shift log history list by dates', () => {
  //   cy.get('[data-testid="historyButton"]').click();
  //   cy.get('[data-testid="logHistoryLabel"]').contains(translation.label.logHistoryTitle);
  //   cy.get('[data-testid="logButton"]').contains(translation.label.logButton);
  //   cy.get('[data-testid="dateEntryStart"]').type(startDate);
  //   cy.get('[data-testid="dateEntryEnd"]').type(endDate);
  //   cy.get('[data-testid="logHistorySearch"]').click();
  //   validateShiftLogDataTable();
  // });

  // it('Content : Verify shift log history list by operator', () => {
  //   cy.get('[data-testid="historyButton"]').click();
  //   cy.get('[data-testid="logHistoryLabel"]').contains(translation.label.logHistoryTitle);
  //   cy.get('[data-testid="logButton"]').contains(translation.label.logButton);
  //   cy.get('[data-testid="logSearchBy"]').click();
  //   cy.contains('Search by operator').click();
  //   cy.get('[data-testid="operatorName"]').click({ force: true });
  //   cy.get('[data-testid="operatorName"]').type('DefaultUser');
  //   cy.get('[data-testid="logHistorySearch"]').click({ force: true });
  //   validateShiftLogDataTable();
  // });

  // it('Content : Verify shift log history list by status', () => {
  //   cy.get('[data-testid="historyButton"]').click();
  //   cy.get('[data-testid="logHistoryLabel"]').contains(translation.label.logHistoryTitle);
  //   cy.get('[data-testid="logButton"]').contains(translation.label.logButton);
  //   cy.get('[data-testid="logSearchBy"]').click();
  //   cy.contains('Search by status').click();
  //   cy.get('[data-testid="sbiStatus"]').click({ force: true });
  //   cy.get('[data-testid="sbiStatus"]').type('Executing');
  //   cy.get('[data-testid="logHistorySearch"]').click({ force: true });
  //   validateShiftLogDataTable();
  // });

  it('Content : Verify shift log history view', () => {
    cy.get('[data-testid="historyButton"]').click();
    cy.get('[data-testid="logHistoryLabel"]').contains(translation.label.logHistoryTitle);
    cy.get('[data-testid="logButton"]').contains(translation.label.logButton);
    cy.get('[data-testid="dateEntryStart"]').type(startDate);
    cy.get('[data-testid="dateEntryEnd"]').type(endDate);
    cy.get('[data-testid="logHistorySearch"]').click();
    validateShiftLogView();
  });

  // it('Content : Verify current shift log flow', () => {
  //   cy.get('[data-testid="manageShift"]').contains(translation.label.manageShift);
  //   cy.get('[data-testid="historyButton"]').contains(translation.label.history);
  //   cy.get('[data-testid="operatorName"]').click();
  //   cy.contains('DefaultUser').click();
  //   cy.get('[data-testid="shiftStartButton"]').contains(translation.label.shiftStart);
  //   cy.get('[data-testid="shiftStartButton"]').click();

  //   cy.get('body').then((element) => {
  //     if (
  //       element.find('[data-testid="confirmationdialog"]') &&
  //       element.find('[data-testid="confirmationDialog"]').length > 0
  //     ) {
  //       cy.get('[data-testid="confirmationDialogYes"]').contains(translation.label.YES);
  //       cy.get('[data-testid="confirmationDialogYes"]').click();

  //     }
  //   });

  //   cy.get('[data-testid="addShiftComments"]').contains(translation.label.addShiftComments);
  //   cy.get('[data-testid="addShiftComments"]').click();

  //   cy.get('body').then((element) => {
  //     if (
  //       element.find('[data-testid="addShiftCommentModal"]') &&
  //       element.find('[data-testid="addShiftCommentModal"]').length > 0
  //     ) {
  //       cy.get('[data-testid="addShiftCommentTitle"]').contains(translation.label.addCommentsAndImages);
  //       cy.get('[data-testid="addShiftComment"]').contains(translation.label.addShiftComments);

  //       cy.get('[data-testid="operatorShiftComment"]').type('This is test shift comment by operator');
  //       cy.get('[data-testid="shiftCommentButton"]').contains(translation.label.add);
  //       cy.get('[data-testid="shiftCommentButton"]').click({ force: true });
  //       cy.get('[data-testid="shiftCommentModalClose"]').contains(translation.label.close);
  //       cy.get('[data-testid="shiftCommentModalClose"]').click({ force: true });
  //       cy.wait(waitTime);
  //     }
  //   });
  //   cy.get('body').then((element) => {
  //     if (
  //       element.find('[data-testid="viewShiftComments"]') &&
  //       element.find('[data-testid="viewShiftComments"]').length > 0
  //     ) {
  //       cy.get('[data-testid="viewShiftComments"]').contains(translation.label.viewShiftComments);
  //       cy.get('[data-testid="commentedAt"]').contains(translation.label.commentedAt);
  //       cy.get('[data-testid="viewShiftCommentImages"]').should('be.visible');
  //       cy.get('[data-testid="shiftComment"]').contains(translation.label.comments);

  //     }
  //   });

  //   cy.get('[data-testid="logSummary"]').contains(translation.label.logSummary);
  //   cy.get('[data-testid="noShiftLogFound"]').contains(translation.label.noLogsFound);
  //   cy.get('[data-testid="shiftEndButton"]').contains(translation.label.shiftEnd);
  //   cy.get('[data-testid="shiftEndButton"]').click({ force: true });

  //   cy.get('body').then((element) => {
  //     if (
  //       element.find('[data-testid="confirmationDialog"]') &&
  //       element.find('[data-testid="confirmationDialog"]').length > 0
  //     ) {
  //       cy.get('[data-testid="confirmationDialogYes"]').contains(translation.label.YES);
  //       cy.get('[data-testid="confirmationDialogYes"]').click();

  //     }
  //   });

  //   // cy.get('[data-testid="shiftEnd"]').contains(translation.label.shiftEnd);
  //   // cy.get('[data-testid="addComment"]').contains(translation.label.addComment);
  //   // cy.get('[data-testid="addImages"]').contains(translation.label.addImages);
  //   // cy.get('[data-testid="viewImages"]').contains(translation.label.viewImages);
  //   // cy.get('[data-testid="operatorComment"]').type('This is test comment by operator');
  //   // cy.get('[data-testid="commentButton"]').click({ force: true });
  //   // cy.get('body').then((element) => {
  //   //   if (
  //   //     element.find('[data-testid="successStatusMsg"]') &&
  //   //     element.find('[data-testid="successStatusMsg"]').length > 0
  //   //   ) {
  //   //     cy.get('[data-testid="successStatusMsg"]').contains(translation.msg.commentSubmit);
  //   //   }
  //   // });

  //   // validateShiftLogDataTable();
  //   // cy.get('[data-testid="shiftEndButton"]').click({ force: true });
  //   // cy.get('body').then((element) => {
  //   //   if (
  //   //     element.find('[data-testid="successStatusMsg"]') &&
  //   //     element.find('[data-testid="successStatusMsg"]').length > 0
  //   //   ) {
  //   //     cy.get('[data-testid="successStatusMsg"]').contains(translation.msg.shiftEnd);
  //   //   }
  //   // });
  // });
});
