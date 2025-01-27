import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../../services/theme/theme';
import SearchByStatus from './SearchByStatus';
import { viewPort } from '../../../../utils/constants';
import { StoreProvider } from '@ska-telescope/ska-gui-local-storage';
import { BrowserRouter } from 'react-router-dom';

const THEME = [THEME_DARK, THEME_LIGHT];

function mounting(theTheme) {
  viewPort();
  const omitData = {
    status: 'Draft'
  };
  cy.mount(
    <StoreProvider>
      <ThemeProvider theme={theme(theTheme)}>
        <CssBaseline />
        <BrowserRouter>
          <SearchByStatus setFilterCriteria={omitData} searchFilter={omitData} />
        </BrowserRouter>
      </ThemeProvider>
    </StoreProvider>
  );
}

describe('SearchByStatus Theme Rendering', () => {
  for (const theTheme of THEME) {
    it(`Theme ${theTheme}: Renders`, () => {
      mounting(theTheme);
      cy.get('body').then(() => {
        cy.get('[data-testid="sbiStatus"]').should('be.visible');
        cy.get('[data-testid="sbiStatus"]').type('Failed');
        cy.get('[data-testid="logHistorySearchByStatus"]').click({ force: true });
      });
    });
  }
});
