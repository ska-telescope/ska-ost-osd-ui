/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../services/theme/theme';
import DisplayShiftComponent from './DisplayShiftComponent';
import { viewPort } from '../../../utils/constants';
import { StoreProvider } from '@ska-telescope/ska-gui-local-storage';
import { BrowserRouter } from 'react-router-dom';

const THEME = [THEME_DARK, THEME_LIGHT];

function mounting(theTheme) {
  viewPort();
  cy.mount(
    <StoreProvider>
      <ThemeProvider theme={theme(theTheme)}>
        <CssBaseline />
        <BrowserRouter>
          <DisplayShiftComponent />
        </BrowserRouter>
      </ThemeProvider>
    </StoreProvider>
  );
}

describe('DisplayShiftComponent Theme Rendering', () => {
  for (const theTheme of THEME) {
    it(`Theme ${theTheme}: Renders`, () => {
      mounting(theTheme);
    });
  }
});
