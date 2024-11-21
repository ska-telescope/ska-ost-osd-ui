/* eslint-disable no-restricted-syntax */
import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../services/theme/theme';
import ViewShiftData from './ViewShiftData';
import SHIFT_DATA_LIST from '../../../DataModels/DataFiles/shiftDataList';

const THEME = [THEME_DARK, THEME_LIGHT];

describe('<ViewShiftData />', () => {

  for (const theTheme of THEME) {
    it(`Theme ${theTheme}: Renders ViewShiftData`, () => {
    const mockData = SHIFT_DATA_LIST[0];
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <ViewShiftData data={mockData} />
      </ThemeProvider>
    );
    cy.get('#operatorName').should('contain', 'label.operatorName');
    
    cy.get('#shiftStart').should('contain', 'label.shiftStartedAt');
    
    cy.get('#shiftEnd').should('contain', 'label.shiftEndsAt');

    cy.get('[data-testid="shiftCommentsHistory"]').should('exist');
    cy.get('[data-testid="shiftCommentsHistory"]').should('contain', 'label.comments');
  });
}
});


