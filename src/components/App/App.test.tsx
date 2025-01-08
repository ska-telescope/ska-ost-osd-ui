import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../services/theme/theme';
import App from './App';

describe('<Components />', () => {
  it(`Theme ${THEME_DARK}: Renders`, () => {
    cy.mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />

        <App />
      </ThemeProvider>
    );
    cy.get('body').then((element) => {
      if (element.find('[testId="footerId"]').length) {
        cy.get('[data-testid="footerId"]').contains('0.2.0').should('be.visible');
        cy.get('[data-testid="headerId"]').contains('Shift Log Tool').should('be.visible');
      }
    });
  });
  it(`Theme ${THEME_LIGHT}: Renders`, () => {
    cy.mount(
      <ThemeProvider theme={theme(THEME_LIGHT)}>
        <CssBaseline />

        <App />
      </ThemeProvider>
    );
    cy.get('body').then((element) => {
      if (element.find('[testId="footerId"]').length) {
        cy.get('[data-testid="footerId"]').contains('0.2.0').should('be.visible');
        cy.get('[data-testid="headerId"]').contains('Shift Log Tool').should('be.visible');
      }
    });
  });
});
