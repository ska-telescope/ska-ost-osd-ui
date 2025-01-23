import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import ShiftHistoryPage from './ShiftHistoryPage';
import theme from '../../services/theme/theme';
import { StoreProvider } from '@ska-telescope/ska-gui-local-storage';
import { BrowserRouter } from 'react-router-dom';
import { viewPort } from '../../utils/constants';

const THEME = [THEME_DARK, THEME_LIGHT];

function mounting(theTheme) {
  viewPort();
  cy.mount(
    <StoreProvider>
      <ThemeProvider theme={theme(theTheme)}>
        <CssBaseline />
        <BrowserRouter>
          <ShiftHistoryPage />
        </BrowserRouter>
      </ThemeProvider>
    </StoreProvider>
  );
}

describe('<ShiftHistoryPage />', () => {
  for (const theTheme of THEME) {
    it(`Theme ${theTheme}: Renders`, () => {
      mounting(theTheme);
      cy.get('body').then(() => {
        cy.get('[data-testid="logSearchBy"]').click();
        cy.contains('Search by operator').click({ force: true });
        cy.get('[data-testid="operatorName"]').type('DefaultUser');
        cy.get('[data-testid="logHistorySearchByOperator"]').click({ force: true });

        cy.get('[data-testid="logSearchBy"]').click();
        cy.contains('Search by status').click({ force: true });
        cy.get('[data-testid="sbiStatus"]').type('Created');
        cy.get('[data-testid="logHistorySearchByStatus"]').click({ force: true });

        cy.get('[data-testid="logSearchBy"]').click();
        cy.contains('Search by EB ID').click({ force: true });
        cy.get('[data-testid="EbId"]').type('eb-t0001-20240822-00009');
        cy.get('[data-testid="logHistorySearchByEBID"]').click({ force: true });

        cy.get('[data-testid="logSearchBy"]').click();
        cy.contains('Search by SBI ID').click({ force: true });
        cy.get('[data-testid="sbiId"]').type('sbi-t0001-20240822-00009');
        cy.get('[data-testid="logHistorySearchBySbiID"]').click({ force: true });
      });
    });
  }
});
