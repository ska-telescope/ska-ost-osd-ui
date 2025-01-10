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
        <ViewShiftData data={SHIFT_DATA_LIST[0]} />
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
    const data = [...SHIFT_DATA_LIST[0].annotations];
    cy.intercept('POST', 'http://127.0.0.1:8000/ska-oso-slt-services/slt/api/v0/shift_annotation', {
      statusCode: 200,
      body: { ...data }
    }).as('postAnnotation');
  });

  beforeEach(() => {
    const data = [SHIFT_DATA_LIST[0]['annotations']];
    cy.intercept(
      'GET',
      'http://127.0.0.1:8000/ska-oso-slt-services/slt/api/v0/shift_annotation?shift_id=slt-20250106-11785506',
      {
        statusCode: 200,
        body: data
      }
    ).as('getDataById');
  });

  it('View Shift Annotation Functionality', () => {
    cy.get('body').then(() => {
      cy.get('#operatorName').should('contain', 'label.operatorName');

      cy.get('#shiftStart').should('contain', 'label.shiftStartedAt');

      cy.get('#shiftEnd').should('contain', 'label.shiftEndsAt');
      cy.get('[data-testid="addShiftAnnotations"]').should('contain', 'label.addShiftAnnotations');
      // cy.get('[data-testid="addShiftAnnotations"]').click({ force: true });
      // cy.get('[data-testid="operatorShiftAnnotation"]').type('This is dummy ammotation');
      // cy.get('[data-testid="shiftAnnotationButton"]').click({ force: true });
      // cy.get('[data-testid="shiftAnnotationModalClose"]').click({ force: true });
      cy.get('[data-testid="addShiftAnnotations"]').click({ force: true });
      cy.get('[data-testid="operatorShiftAnnotation"]').type('This is dummy Annotations');
      cy.get('[data-testid="shiftAnnotationButton"]').click({ force: true });
      cy.wait('@postAnnotation');
      cy.wait('@getDataById');
      cy.get('[data-testid="shiftAnnotationModalClose"]').click({ force: true });
      cy.get('[data-testid="editShiftAnnotation0"]').click({ force: true });
      cy.get('[data-testid="operatorShiftAnnotation"]').type('This is dummy Annotations');
      cy.get('[data-testid="shiftAnnotationButton"]').click({ force: true });
      cy.get('[data-testid="shiftAnnotationModalClose"]').click({ force: true });
    });
  });
});
