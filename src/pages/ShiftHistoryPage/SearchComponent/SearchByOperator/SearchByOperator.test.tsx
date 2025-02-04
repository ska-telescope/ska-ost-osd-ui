import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../../services/theme/theme';
import SearchByOperator from './SearchByOperator';
import { viewPort } from '../../../../utils/constants';
import { StoreProvider } from '@ska-telescope/ska-gui-local-storage';
import { BrowserRouter } from 'react-router-dom';
const THEME = [THEME_DARK, THEME_LIGHT];

function mounting(theTheme) {
  viewPort();
  const omitData = {
    shift_operator: 'DefaultUser'
  };
  cy.mount(
    <StoreProvider>
      <ThemeProvider theme={theme(theTheme)}>
        <CssBaseline />
        <BrowserRouter>
          <SearchByOperator setFilterCriteria={omitData} searchFilter={omitData} />
        </BrowserRouter>
      </ThemeProvider>
    </StoreProvider>
  );
}

describe('SearchByOperator Theme Rendering', () => {
  for (const theTheme of THEME) {
    it(`Theme ${theTheme}: Renders`, () => {
      mounting(theTheme);
      cy.get('body').then(() => {
        cy.get('[data-testid="logHistorySearchByOperatorName"]').should('be.visible');
        cy.get('[data-testid="logHistorySearchByOperatorName"]').type('DefaultUser');
        cy.get('[data-testid="logHistorySearchByOperatorName"]').type('{downarrow}');
        cy.get('[data-testid="logHistorySearchByOperatorName"]').type('{enter}');
        cy.get('[data-testid="logHistorySearchByOperator"]').click({ force: true });
      });
    });
  }
});
