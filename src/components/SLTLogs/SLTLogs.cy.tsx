import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../services/theme/theme';
import SLTLogs from './SLTLogs';

const THEME = [THEME_DARK, THEME_LIGHT];

describe('<SLTLogs />', () => {
  for (const theTheme of THEME) {
    it(`Theme ${theTheme}: Renders SLTLogs`, () => {
      mount(
        <ThemeProvider theme={theme(theTheme)}>
          <CssBaseline />
          <SLTLogs  />
        </ThemeProvider>
      );
    });
  }
});
