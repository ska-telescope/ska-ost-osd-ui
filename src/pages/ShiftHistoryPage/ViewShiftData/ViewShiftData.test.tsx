/* eslint-disable no-restricted-syntax */
import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../services/theme/theme';
import ViewShiftData from './ViewShiftData';
import SHIFT_DATA_LIST from '../../../DataModels/DataFiles/ShiftDataList';
import { viewPort } from '../../../utils/constants';
import { StoreProvider } from '@ska-telescope/ska-gui-local-storage';

const THEME = [THEME_DARK, THEME_LIGHT];
function mounting(theTheme) {
  viewPort();

  cy.mount(
    <StoreProvider>
      <ThemeProvider theme={theme(theTheme)}>
        <CssBaseline />
        <ViewShiftData data={SHIFT_DATA_LIST[0]} isLocalData={false} />
      </ThemeProvider>
    </StoreProvider>
  );
}
function mountingWithNoAnnotation(theTheme) {
  viewPort();

  cy.mount(
    <StoreProvider>
      <ThemeProvider theme={theme(theTheme)}>
        <CssBaseline />
        <ViewShiftData data={SHIFT_DATA_LIST[1]} isLocalData={false} />
      </ThemeProvider>
    </StoreProvider>
  );
}
function mountingWithMock(theTheme) {
  viewPort();

  cy.mount(
    <StoreProvider>
      <ThemeProvider theme={theme(theTheme)}>
        <CssBaseline />
        <ViewShiftData data={SHIFT_DATA_LIST[1]} isLocalData={true} />
      </ThemeProvider>
    </StoreProvider>
  );
}
function mountingWithActiveShift(theTheme) {
  viewPort();

  cy.mount(
    <StoreProvider>
      <ThemeProvider theme={theme(theTheme)}>
        <CssBaseline />
        <ViewShiftData data={SHIFT_DATA_LIST[2]} isLocalData={false} />
      </ThemeProvider>
    </StoreProvider>
  );
}
describe('<DisplayShiftComponent />', () => {
  for (const theTheme of THEME) {
    it(`Theme ${theTheme}: Renders`, () => {
      mounting(theTheme);
    });
  }
});

describe('<DisplayShiftComponent />', () => {
  beforeEach(() => {
    mounting(THEME[1]);
  });

  beforeEach(() => {
    const data = [...SHIFT_DATA_LIST[0].annotation];
    cy.intercept('POST', '/__cypress/iframes/undefined/shift_annotation', {
      statusCode: 200,
      body: { ...data }
    }).as('postAnnotation');
  });

  beforeEach(() => {
    const data = [SHIFT_DATA_LIST[0]['annotations']];
    cy.intercept(
      'GET',
      '/__cypress/iframes/undefined/shift_annotation?shift_id=slt-20250106-11785506',
      {
        statusCode: 200,
        body: data
      }
    ).as('getDataById');
  });
  beforeEach(() => {
    const data = [...SHIFT_DATA_LIST[0].shift_logs[0]['comments']];
    cy.intercept('POST', '/__cypress/iframes/undefined/shift_log_comment', {
      statusCode: 200,
      body: { ...data }
    }).as('postComment');
  });
  beforeEach(() => {
    const data = [...SHIFT_DATA_LIST[0].shift_logs[0]['comments']];
    cy.intercept('PUT', '/__cypress/iframes/undefined/shift_log_comment/1', {
      statusCode: 200,
      body: { ...data }
    }).as('putComment');
  });
  beforeEach(() => {
    const data = [...SHIFT_DATA_LIST[0].annotation];
    cy.intercept('PUT', '/__cypress/iframes/undefined/shift_annotation/1', {
      statusCode: 200,
      body: { ...data }
    }).as('putAnnotation');
  });
  it('View Shift Data Functionality', () => {
    cy.get('body').then(() => {
      cy.get('#operatorName').should('contain', 'label.operatorName');
      cy.get('#shiftStart').should('contain', 'label.shiftStartedAt');
      cy.get('#shiftEnd').should('contain', 'label.shiftEndsAt');
      cy.get('[data-testid="addShiftAnnotations"]').should('contain', 'label.addShiftAnnotations');
      cy.get('[data-testid="addShiftAnnotations"]').click({ force: true });
      cy.get('[data-testid="operatorShiftAnnotation"]').type('This is dummy Annotations');
      cy.get('[data-testid="shiftAnnotationButton"]').click({ force: true });
      cy.wait('@postAnnotation');
      // cy.wait('@getDataById');
      cy.get('[data-testid="shiftAnnotationModalClose"]').click({ force: true });
      cy.get('[data-testid="editShiftAnnotation0"]').click({ force: true });
      cy.get('[data-testid="operatorShiftAnnotation"]').type('This is dummy Annotations');
      cy.get('[data-testid="shiftAnnotationButton"]').click({ force: true });
      cy.wait('@putAnnotation');
      cy.get('[data-testid="shiftAnnotationModalClose"]').click({ force: true });
      cy.get('[data-testid="viewShiftHistoryImagesHistory0"]').click({ force: true });
      cy.get('[data-testid="noImageMsg"]').contains('label.noImageFound');

      cy.get('[data-testid="shiftAnnotationModalImageClose"]').click({ force: true });
      cy.get('[data-testid="viewLogDataIDLabel"]').contains('label.logSummary');
    });
  });
});

describe('<DisplayShiftComponent />', () => {
  for (const theTheme of THEME) {
    it('View Shift Data Functionality with no annotation', () => {
      mountingWithNoAnnotation(theTheme);
    });
  }
});

describe('<DisplayShiftComponent />', () => {
  for (const theTheme of THEME) {
    it('View Shift Data Functionality with mock data', () => {
      mountingWithMock(theTheme);
      cy.get('body').then(() => {
        cy.get('#operatorName').should('contain', 'label.operatorName');
        cy.get('#shiftStart').should('contain', 'label.shiftStartedAt');
        cy.get('#shiftEnd').should('contain', 'label.shiftEndsAt');
        cy.get('[data-testid="addShiftAnnotations"]').should(
          'contain',
          'label.addShiftAnnotations'
        );
        cy.get('[data-testid="addShiftAnnotations"]').click({ force: true });
        cy.get('[data-testid="operatorShiftAnnotation"]').type('This is dummy Annotations');
        cy.get('[data-testid="shiftAnnotationButton"]').click({ force: true });
        cy.get('[data-testid="shiftAnnotationModalClose"]').click({ force: true });
        cy.get('[data-testid="viewShiftCommentsHistory"]').contains('label.viewShiftComments');
        cy.get('[data-testid="viewLogDataIDLabel"]').contains('label.logSummary');
      });
    });
  }
});

describe('<DisplayShiftComponent />', () => {
  beforeEach(() => {
    const data = [...SHIFT_DATA_LIST[0].annotation];
    cy.intercept('POST', '/__cypress/iframes/undefined/shift_annotation', {
      statusCode: 200,
      body: { ...data }
    }).as('postAnnotation');
  });

  for (const theTheme of THEME) {
    it('View Shift Data Functionality with active', () => {
      mountingWithActiveShift(theTheme);
      cy.get('body').then(() => {
        cy.get('#operatorName').should('contain', 'label.operatorName');
        cy.get('#shiftStart').should('contain', 'label.shiftStartedAt');
        cy.get('#shiftEnd').should('contain', 'label.shiftEndsAt');
        cy.get('[data-testid="addShiftAnnotations"]').should(
          'contain',
          'label.addShiftAnnotations'
        );
        cy.get('[data-testid="addShiftAnnotations"]').click({ force: true });
        cy.get('[data-testid="operatorShiftAnnotation"]').type('This is dummy Annotations');
        cy.get('[data-testid="shiftAnnotationButton"]').click({ force: true });
        cy.wait('@postAnnotation');
        cy.get('[data-testid="shiftAnnotationModalClose"]').click({ force: true });
        cy.get('[data-testid="viewShiftCommentsHistory"]').contains('label.viewShiftComments');
        cy.get('[data-testid="noAnnotationsFound"]').contains('label.noAnnotationsFound');
        cy.get('[data-testid="viewLogDataIDLabel"]').contains('label.logSummary');
      });
    });
  }
});
