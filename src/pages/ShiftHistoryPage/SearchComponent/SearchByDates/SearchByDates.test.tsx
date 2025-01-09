import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../../services/theme/theme';
import SearchByDates from './SearchByDates';
import { viewPort } from '../../../../utils/constants';
import { StoreProvider } from '@ska-telescope/ska-gui-local-storage';
import { BrowserRouter } from 'react-router-dom';
import moment from 'moment';

const THEME = [THEME_DARK, THEME_LIGHT];

function mounting(theTheme) {
  viewPort();
  const startDate = moment().utc().subtract(300, 'days').format('YYYY-MM-DD');
  const endDate = moment().utc().format('YYYY-MM-DD');
  const createdAfter = startDate;
  const createdBefore = endDate;
  const omitData = {
    createdAfter,
    createdBefore
  };
  cy.mount(
    <StoreProvider>
      <ThemeProvider theme={theme(theTheme)}>
        <CssBaseline />
        <BrowserRouter>
          <SearchByDates setFilterCriteria={omitData} searchFilter={omitData} />
        </BrowserRouter>
      </ThemeProvider>
    </StoreProvider>
  );
}

describe('<DisplayShiftComponent />', () => {
  for (const theTheme of THEME) {
    it(`Theme ${theTheme}: Renders`, () => {
      mounting(theTheme);
      cy.get('body').then(() => {
        cy.get('[data-testid="dateEntryStart"]').should('be.visible');
        cy.get('[data-testid="dateEntryStart"]').click({ force: true });
        cy.get('[data-testid="dateEntryEnd"]').should('be.visible');
        cy.get('[data-testid="dateEntryEnd"]').click({ force: true });
        cy.get('[data-testid="logHistorySearch"]').should('be.visible');
        cy.get('[data-testid="logHistorySearch"]').click({ force: true });
      });
    });
  }
});
