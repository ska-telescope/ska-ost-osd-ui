import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../../services/theme/theme';
import SearchByDates from './SearchByDates';
import moment from 'moment';

describe('<SearchByDates />', () => {
  const startDate = moment().utc().subtract(300, 'days').format('YYYY-MM-DD');
  const endDate = moment().utc().format('YYYY-MM-DD');
  const createdAfter = startDate;
  const createdBefore = endDate;
  const emmitData = {
    createdAfter,
    createdBefore
  };
  it(`Theme ${THEME_DARK}: Renders SearchByDates`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <SearchByDates setFilterCriteria={undefined} searchFilter={emmitData} />
      </ThemeProvider>
    );
    cy.get('body').then(() => {
      cy.get('[data-testid="dateEntryStart"]').should('be.visible');
      cy.get('[data-testid="dateEntryStart"]').click({ force: true });
      cy.get('[data-testid="dateEntryEnd"]').should('be.visible');
      cy.get('[data-testid="dateEntryEnd"]').click({ force: true });
      cy.get('[data-testid="logHistorySearch"]').should('be.visible');
      cy.get('[data-testid="logHistorySearch"]').click({ force: true });
    });
  });

  it(`Theme ${THEME_LIGHT}: Renders SearchByDates`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <SearchByDates setFilterCriteria={undefined} searchFilter={undefined} />
      </ThemeProvider>
    );
    cy.get('body').then(() => {
      cy.get('[data-testid="dateEntryStart"]').should('be.visible');
      cy.get('[data-testid="dateEntryStart"]').click({ force: true });
      cy.get('[data-testid="dateEntryEnd"]').should('be.visible');
      cy.get('[data-testid="dateEntryEnd"]').click({ force: true });
      cy.get('[data-testid="logHistorySearch"]').should('be.visible');
      cy.get('[data-testid="logHistorySearch"]').click({ force: true });
    });
  });
});
