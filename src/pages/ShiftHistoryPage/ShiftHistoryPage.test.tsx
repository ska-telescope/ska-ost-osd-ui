import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import ShiftHistoryPage from './ShiftHistoryPage';
import theme from '../../services/theme/theme';

describe('<ShiftHistoryPage />', () => {
  it(`Theme ${THEME_DARK}: Renders ShiftHistoryPage`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <ShiftHistoryPage />
      </ThemeProvider>
    );
  });

  it(`Theme ${THEME_LIGHT}: Renders ShiftHistoryPage`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_LIGHT)}>
        <CssBaseline />
        <ShiftHistoryPage />
      </ThemeProvider>
    );
  });
});
