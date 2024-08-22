import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../services/theme/theme';
import SLTLogs from './SLTLogs';

describe('<SLTLogs />', () => {
  it(`Theme ${THEME_DARK}: Renders SLTLogs`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <SLTLogs />
      </ThemeProvider>
    );
  });

  it(`Theme ${THEME_LIGHT}: Renders SLTLogs`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_LIGHT)}>
        <CssBaseline />
        <SLTLogs />
      </ThemeProvider>
    );
  });
});
