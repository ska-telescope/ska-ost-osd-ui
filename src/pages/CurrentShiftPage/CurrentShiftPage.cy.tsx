import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../services/theme/theme';
import CurrentActiveShift from './CurrentShiftPage';

describe('<CurrentActiveShift />', () => {
  it(`Theme ${THEME_DARK}: Renders CurrentActiveShift`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <CurrentActiveShift />
      </ThemeProvider>
    );
  });

  it(`Theme ${THEME_LIGHT}: Renders CurrentActiveShift`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_LIGHT)}>
        <CssBaseline />
        <CurrentActiveShift />
      </ThemeProvider>
    );
  });
});
