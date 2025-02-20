import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../services/theme/theme';
import DynamicForm from './DynamicForm';

const THEME = [THEME_DARK, THEME_LIGHT];

const mockInitialData = {
  stringField: 'test string',
  numberField: 123,
  booleanField: true,
  nestedField: {
    subField: 'nested value'
  }
};

let mockOnUpdate;
let mockOnDelete;
let mockOnAdd;
let mockOnEdit;

describe('<DynamicForm />', () => {
  beforeEach(() => {
    mockOnUpdate = cy.stub().as('onUpdateStub');
    mockOnDelete = cy.stub().as('onDeleteStub');
    mockOnAdd = cy.stub().as('onAddStub');
    mockOnEdit = cy.stub().as('onEditStub');
  });

  function mount(theTheme, data = mockInitialData) {
    cy.mount(
      <ThemeProvider theme={theme(theTheme)}>
        <CssBaseline />
        <DynamicForm
          data={data}
          path={[]}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          onAdd={mockOnAdd}
          onEdit={mockOnEdit}
        />
      </ThemeProvider>
    );
  }

  for (const theTheme of THEME) {
    describe(`Theme ${theTheme}`, () => {
      it('triggers onEdit for nested object editing', () => {
        mount(theTheme);
        cy.get('[data-testid="edit-button"]').first().click();
        cy.get('@onEditStub').should('have.been.calledWith', ['nestedField']);
      });

      it('triggers onDelete for field deletion', () => {
        mount(theTheme);
        cy.get('[data-testid="delete-button"]').first().click();
        cy.get('@onDeleteStub').should('have.been.calledWith', ['nestedField']);
      });

      it('triggers add Button for field addition', () => {
        mount(theTheme);
        cy.get('[data-testid="add-button"]').first().click();
        // cy.get('@onAddStub').should('have.been.calledWith', ['nestedField']);
      });

      it('displays field container with correct label', () => {
        mount(theTheme);
        cy.get('[data-testid="field-container"]').should('be.visible');
        cy.contains('stringField').should('be.visible');
      });
    });
  }
});
