import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../services/theme/theme';
import DisplayShiftComponent from './DisplayShiftComponent';

describe('<DisplayShiftComponent />', () => {
  it(`Theme ${THEME_DARK}: Renders DisplayShiftComponent`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <DisplayShiftComponent />
      </ThemeProvider>
    );
  });

  it(`Theme ${THEME_LIGHT}: Renders DisplayShiftComponent`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_LIGHT)}>
        <CssBaseline />
        <DisplayShiftComponent />
      </ThemeProvider>
    );
  });
});
