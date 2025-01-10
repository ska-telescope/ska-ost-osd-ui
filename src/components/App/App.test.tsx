import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../services/theme/theme';
import App from './App';
import { StoreProvider } from '@ska-telescope/ska-gui-local-storage';
import { BrowserRouter } from 'react-router-dom';
import { viewPort } from '../../utils/constants';

const THEME = [THEME_DARK, THEME_LIGHT];

describe('<Components />', () => {
  function mount(theTheme) {
    viewPort();
    cy.mount(
      <StoreProvider>
        <ThemeProvider theme={theme(theTheme)}>
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </StoreProvider>
    );
  }
  for (const theTheme of THEME) {
    it(`Theme ${theTheme}: Renders App`, () => {
      mount(theTheme);
    });
  }
});
