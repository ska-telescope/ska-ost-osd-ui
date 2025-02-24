import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../services/theme/theme';
import JsonEditor from './JsonEditor';

const THEME = [THEME_DARK, THEME_LIGHT];

const mockInitialData = {
  field1: 'value1',
  field2: 'value2'
};

let mockOnSave;

describe('<JsonEditor />', () => {
  beforeEach(() => {
    mockOnSave = cy.stub().as('onSaveStub');
  });

  function mount(theTheme) {
    cy.mount(
      <ThemeProvider theme={theme(theTheme)}>
        <CssBaseline />
        <JsonEditor
          initialData={mockInitialData}
          onSave={mockOnSave}
          onRelease={function (): void {
            throw new Error('Function not implemented.');
          }}
          cycleData={''}
          setRoute={function (): void {
            throw new Error('Function not implemented.');
          }}
          versionData={''}
          isSuccess={false}
        />
      </ThemeProvider>
    );
  }

  for (const theTheme of THEME) {
    describe(`Theme ${theTheme}`, () => {
      it('opens edit dialog when Edit Changes is clicked', () => {
        mount(theTheme);
      });
    });
  }
});
