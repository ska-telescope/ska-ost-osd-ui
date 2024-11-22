import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../services/theme/theme';
import Routing from './Routing';

describe('<Legend />', () => {
  it(`Theme ${THEME_DARK}: Renders`, () => {
    cy.mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <Routing />
      </ThemeProvider>
    );
  });

  it(`Theme ${THEME_LIGHT}: Renders`, () => {
    cy.mount(
      <ThemeProvider theme={theme(THEME_LIGHT)}>
        <CssBaseline />
        <Routing />
      </ThemeProvider>
    );
  });
});
