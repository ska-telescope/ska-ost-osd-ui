import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../../services/theme/theme';
import SearchByEbi from './SearchByEb';

describe('<SearchByEb />', () => {
  it(`Theme ${THEME_DARK}: Renders SearchByEbId`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <SearchByEbi setFilterCriteria={undefined} searchFilter={undefined} />
      </ThemeProvider>
    );
  });

  it(`Theme ${THEME_LIGHT}: Renders SearchByEbId`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <SearchByEbi setFilterCriteria={undefined} searchFilter={undefined} />
      </ThemeProvider>
    );
  });
});
