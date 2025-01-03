import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../../services/theme/theme';
import SearchByOperator from './SearchByOperator';

describe('<SearchByOperator />', () => {
  it(`Theme ${THEME_DARK}: Renders SearchByOperator`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <SearchByOperator setFilterCriteria={undefined} searchFilter={undefined} />
      </ThemeProvider>
    );
  });

  it(`Theme ${THEME_LIGHT}: Renders SearchByOperator`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <SearchByOperator setFilterCriteria={undefined} searchFilter={undefined} />
      </ThemeProvider>
    );
  });
});
