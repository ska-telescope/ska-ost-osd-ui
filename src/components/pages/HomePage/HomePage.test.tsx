import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../services/theme/theme';
import HomePage from './HomePage';
import { StoreProvider } from '@ska-telescope/ska-gui-local-storage';
import { BrowserRouter } from 'react-router-dom';
import { viewPort } from '../../../utils/constants';
import CYCLE_DATA_LIST from '../../../DataModels/DataFiles/CycleDataList';
import OSD_DATA from '../../../DataModels/DataFiles/OsdData';

const THEME = [THEME_DARK, THEME_LIGHT];

function mounting(theTheme) {
  viewPort();
  cy.mount(
    <StoreProvider>
      <ThemeProvider theme={theme(theTheme)}>
        <CssBaseline />
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </ThemeProvider>
    </StoreProvider>
  );
}

describe('Components', () => {
  function mount(theTheme) {
    viewPort();
    cy.mount(
      <StoreProvider>
        <ThemeProvider theme={theme(theTheme)}>
          <CssBaseline />
          <BrowserRouter>
            <HomePage />
          </BrowserRouter>
        </ThemeProvider>
      </StoreProvider>
    );
  }
  for (const theTheme of THEME) {
    it(`Theme ${theTheme}: Renders HomePage`, () => {
      mount(theTheme);
    });
  }
});

describe('HomePage Test Cases', () => {
  beforeEach(() => {
    mounting(THEME[1]);
  });

  beforeEach(() => {
    const data = [...CYCLE_DATA_LIST[0].cycles];

    cy.intercept('POST', `/__cypress/iframes/undefined/cycle`, {
      statusCode: 200,
      body: { ...data }
    }).as('handleCycle');
  });

  beforeEach(() => {
    const data = [OSD_DATA[0]['capabilities']];

    cy.intercept('POST', `/__cypress/iframes/undefined/osd`, {
      statusCode: 200,
      body: { ...data }
    }).as('handleOsd');
  });

  it('Checking Elements Are Present or Not', () => {
    cy.get('[data-testid="fieldTypeSelect"]').contains('label.cycleField');

    cy.get('[data-testid="fieldTypeSelect"]').click({ force: true });
    cy.get('[data-testid="fieldTypeSelect"]').type('{downarrow}');

    cy.get('[data-testid="fieldTypeSelect"]').click({ force: true });
  });

  it('should close dropdown when clicking outside', () => {
    cy.get('[data-testid="fieldTypeSelect"]').click();

    cy.get('body').click(0, 0);

    cy.get('[role="listbox"]').should('not.exist');
  });
});
