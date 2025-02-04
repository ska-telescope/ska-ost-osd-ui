import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../services/theme/theme';
import ApiErrorDialog from './ApiErrorDialog';

const THEME = [THEME_DARK, THEME_LIGHT];

let mockOnClose;

describe('<ApiErrorDialog />', () => {
  beforeEach(() => {
    mockOnClose = cy.stub().as('onCloseStub');
  });

  function mount(theTheme, open = true, error = 'Test error message') {
    cy.mount(
      <ThemeProvider theme={theme(theTheme)}>
        <CssBaseline />
        <ApiErrorDialog
          open={open}
          error={error}
          onClose={mockOnClose}
        />
      </ThemeProvider>
    );
  }

  for (const theTheme of THEME) {
    describe(`Theme ${theTheme}`, () => {
      it('renders when open', () => {
        mount(theTheme);
        cy.contains('Error').should('be.visible');
        cy.contains('Test error message').should('be.visible');
      });

      it('does not render when closed', () => {
        mount(theTheme, false);
        cy.contains('Error').should('not.exist');
      });

      it('calls onClose when close button is clicked', () => {
        mount(theTheme);
        cy.get('[data-testid="error-dialog-close-button"]').click();
        cy.get('@onCloseStub').should('have.been.called');
      });

      it('displays the provided error message', () => {
        const errorMessage = 'Custom error message';
        mount(theTheme, true, errorMessage);
        cy.contains(errorMessage).should('be.visible');
      });

      it('closes dialog when clicking outside', () => {
        mount(theTheme);
        cy.get('.MuiDialog-root').click('topLeft');
        cy.get('@onCloseStub').should('have.been.called');
      });

      it('has correct dialog title', () => {
        mount(theTheme);
        cy.contains('Error Saving Changes').should('be.visible');
      });
    });
  }
});