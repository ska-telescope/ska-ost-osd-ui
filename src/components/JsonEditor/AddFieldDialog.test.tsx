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
        cy.get('button').contains('Cancel').click();
        cy.get('@onCloseStub').should('have.been.called');
      });
    });
  }
});