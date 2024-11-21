/* eslint-disable no-restricted-syntax */
import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../services/theme/theme';
import DisplayShiftComponent from './DisplayShiftComponent';

const THEME = [THEME_DARK, THEME_LIGHT];

describe('<DisplayShiftComponent />', () => {

  for (const theTheme of THEME) {

    it(`Theme ${theTheme}: Renders DisplayShiftComponent`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <DisplayShiftComponent />
      </ThemeProvider>
    );

    cy.get('body').then((element) => {

      if (element.find('[testId="historyButton"]').length) {
      cy.get('[testId="historyButton"]').should('contain', 'label.history');
      }
    });

    cy.get('body').then((element) => {

    if (element.find('[data-testid="operatorName"]').length) {
      cy.get('[data-testid="operatorName"]').should('contain', 'label.operatorName');
      }

    });

    cy.get('body').then((element) => {

    if (element.find('[testId="shiftStartButton"]').length) {
      cy.get('[testId="shiftStartButton"]').should('contain', 'label.shiftStartButton');
      }

    });

    cy.get('body').then((element) => {

    if (element.find('[data-testid="manageShift"]').length) {
        cy.get('[data-testid="manageShift"]').should('contain', 'label.manageShift');
        }

      });

  });

}
});

