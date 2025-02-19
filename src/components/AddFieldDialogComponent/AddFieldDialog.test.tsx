import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../services/theme/theme';
import AddFieldDialog from './AddFieldDialog';

const THEME = [THEME_DARK, THEME_LIGHT];

let mockOnAdd;
let mockOnClose;

describe('<AddFieldDialog />', () => {
  beforeEach(() => {
    mockOnAdd = cy.stub().as('onAddStub');
    mockOnClose = cy.stub().as('onCloseStub');
  });

  function mount(theTheme, open = true) {
    cy.mount(
      <ThemeProvider theme={theme(theTheme)}>
        <CssBaseline />
        <AddFieldDialog
          open={open}
          onAdd={mockOnAdd}
          onClose={mockOnClose}
        />
      </ThemeProvider>
    );
  }

  for (const theTheme of THEME) {
    describe(`Theme ${theTheme}`, () => {

      it('does not render when closed', () => {
        mount(theTheme, false);
        cy.contains('Add New Field').should('not.exist');
      });

      it('calls onClose when cancel is clicked', () => {
        mount(theTheme);
        cy.get('[data-testid="cancel-button"]').click();
        cy.get('@onCloseStub').should('have.been.called');
      });

      it('handles invalid JSON object input', () => {
        mount(theTheme);
        cy.get('[data-testid="field-name-input"]').type('invalidObject');
        cy.get('[data-testid="field-type-select"]').click();
        cy.get('[data-value="object"]').click();
        cy.get('[data-testid="field-value-input"]').type('invalid json');
        cy.get('[data-testid="add-field-button"]').click();
        cy.get('@onAddStub').should('have.been.calledWith', 'invalidObject', {});
      });

      it('handles empty array input', () => {
        mount(theTheme);
        cy.get('[data-testid="field-name-input"]').type('emptyArray');
        cy.get('[data-testid="field-type-select"]').click();
        cy.get('[data-value="array"]').click();
        cy.get('[data-testid="add-field-button"]').should('not.be.enabled');
        cy.get('@onAddStub').should('have.not.been.calledWith', 'emptyArray', []);
      });

      it('closes dialog with close icon button', () => {
        mount(theTheme);
        cy.get('[data-testid="close-icon-button"]').click();
        cy.get('@onCloseStub').should('have.been.called');
      });
    });
  }
});