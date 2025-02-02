import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../services/theme/theme';
import EditFieldDialog from './EditFieldDialog';

const THEME = [THEME_DARK, THEME_LIGHT];

let mockOnSave;
let mockOnClose;

describe('<EditFieldDialog />', () => {
  beforeEach(() => {
    mockOnSave = cy.stub().as('onSaveStub');
    mockOnClose = cy.stub().as('onCloseStub');
  });

  function mount(theTheme, fieldType = 'string', initialValue = 'test value', open = true) {
    cy.mount(
      <ThemeProvider theme={theme(theTheme)}>
        <CssBaseline />
        <EditFieldDialog
          open={open}
          fieldType={fieldType}
          initialValue={initialValue}
          onSave={mockOnSave}
          onClose={mockOnClose}
        />
      </ThemeProvider>
    );
  }

  for (const theTheme of THEME) {
    describe(`Theme ${theTheme}`, () => {

      it('does not render when closed', () => {
        mount(theTheme, 'string', 'test value', false);
        cy.contains('Edit Field').should('not.exist');
      });
      
      it('calls onClose when cancel is clicked', () => {
        mount(theTheme);
        cy.get('button').contains('Cancel').click();
        cy.get('@onCloseStub').should('have.been.called');
      });
    });
  }
});