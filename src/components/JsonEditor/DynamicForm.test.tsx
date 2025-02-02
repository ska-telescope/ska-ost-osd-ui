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
        cy.contains('nestedField').parent().find('button[aria-label="edit"]').click();
        cy.get('@onEditStub').should('have.been.calledWith', ['nestedField']);
      });
    });
  }
});