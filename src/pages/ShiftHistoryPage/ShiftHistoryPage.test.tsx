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

describe('ShiftHistoryPage Theme Rendering', () => {
  for (const theTheme of THEME) {
    it(`Theme ${theTheme}: Renders`, () => {
      mounting(theTheme);
    });
  }
});
