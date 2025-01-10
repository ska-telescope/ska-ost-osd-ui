import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../../services/theme/theme';
import SHIFT_DATA_LIST from '../../../../DataModels/DataFiles/ShiftDataList';
import ViewSLTHistoryPreview from './ViewSLTHistoryPreview';
import { StoreProvider } from '@ska-telescope/ska-gui-local-storage';
import { viewPort } from '../../../../utils/constants';

const THEME = [THEME_DARK, THEME_LIGHT];

function mounting(theTheme) {
  viewPort();
  cy.mount(
    <StoreProvider>
      <ThemeProvider theme={theme(theTheme)}>
        <CssBaseline />
        <ViewSLTHistoryPreview shiftData={SHIFT_DATA_LIST[0]} updatedList={SHIFT_DATA_LIST[0]} />
      </ThemeProvider>
    </StoreProvider>
  );
}

describe('<DisplayShiftComponent />', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      'http://127.0.0.1:8000/ska-oso-slt-services/slt/api/v0/shift?shift_id=slt-20250106-11785506',
      {
        statusCode: 200,
        body: { status: '200', data: SHIFT_DATA_LIST[0] }
      }
    ).as('getData');
  });

  for (const theTheme of THEME) {
    it(`Theme ${theTheme}: Renders`, () => {
      mounting(theTheme);
      cy.get('body').then(() => {
        cy.get('[data-testid="iconViewShift"]').should('be.visible');
        cy.get('[data-testid="iconViewShift"]').click({ force: true });
        cy.wait('@getData'); // Wait for the API call to complete
      });
    });
  }
});
