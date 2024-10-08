import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../../services/theme/theme';
import SearchByStatus from './SearchByStatus';

describe('<SearchByStatus />', () => {
  it(`Theme ${THEME_DARK}: Renders SearchByStatus`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <SearchByStatus setFilterCirteria={undefined} />
      </ThemeProvider>
    );
  });

  it(`Theme ${THEME_LIGHT}: Renders SearchByStatus`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <SearchByStatus setFilterCirteria={undefined} />
      </ThemeProvider>
    );
  });
});
