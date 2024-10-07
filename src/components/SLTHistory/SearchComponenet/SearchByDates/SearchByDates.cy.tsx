import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../../services/theme/theme';
import SearchByDates from './SearchByDates';

describe('<SearchByDates />', () => {
  it(`Theme ${THEME_DARK}: Renders SearchByDates`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <SearchByDates setFilterCirteria={undefined} />
      </ThemeProvider>
    );
  });

  it(`Theme ${THEME_LIGHT}: Renders SearchByDates`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <SearchByDates setFilterCirteria={undefined} />
      </ThemeProvider>
    );
  });
});
