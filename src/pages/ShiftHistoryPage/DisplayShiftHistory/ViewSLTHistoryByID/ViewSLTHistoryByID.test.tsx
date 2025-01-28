import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../../services/theme/theme';
import SHIFT_DATA_LIST from '../../../../DataModels/DataFiles/ShiftDataList';
import ViewSLTHistoryByID from './ViewSLTHistoryByID';
import { StoreProvider } from '@ska-telescope/ska-gui-local-storage';
import { viewPort } from '../../../../utils/constants';

const THEME = [THEME_DARK, THEME_LIGHT];

function mounting(theTheme) {
  viewPort();
  cy.mount(
    <StoreProvider>
      <ThemeProvider theme={theme(theTheme)}>
        <CssBaseline />
        <ViewSLTHistoryByID
          shiftData={SHIFT_DATA_LIST[0]}
          updatedList={SHIFT_DATA_LIST[0]}
          isLocalData={false}
        />
      </ThemeProvider>
    </StoreProvider>
  );
}
function mountingWithMock(theTheme) {
  viewPort();
  cy.mount(
    <StoreProvider>
      <ThemeProvider theme={theme(theTheme)}>
        <CssBaseline />
        <ViewSLTHistoryByID
          shiftData={SHIFT_DATA_LIST[0]}
          updatedList={SHIFT_DATA_LIST[0]}
          isLocalData={true}
        />
      </ThemeProvider>
    </StoreProvider>
  );
}

describe('<ViewSLTHistoryByID />', () => {
  for (const theTheme of THEME) {
    it(`Theme ${theTheme}: Renders`, () => {
      mounting(theTheme);
      cy.get('body').then(() => {
        cy.get('[data-testid="shiftId"]').should('be.visible');
        cy.get('[data-testid="shiftId"]').click({ force: true });
      });
    });
  }
});

describe('<ViewSLTHistoryByID />', () => {
  for (const theTheme of THEME) {
    it(`Theme ${theTheme}: Renders`, () => {
      mountingWithMock(theTheme);
      cy.get('body').then(() => {
        cy.get('[data-testid="shiftId"]').should('be.visible');
        cy.get('[data-testid="shiftId"]').click({ force: true });
      });
    });
  }
});
