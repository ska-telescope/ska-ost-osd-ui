import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../services/theme/theme';
import ViewSLTHistory from './ViewSLTHistory';

describe('<ViewSLTHistory />', () => {
  it(`Theme ${THEME_DARK}: Renders ViewSLTHistory`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <ViewSLTHistory shiftData={undefined} updatedList={undefined} />
      </ThemeProvider>,
    );
  });

  it(`Theme ${THEME_LIGHT}: Renders ViewSLTHistory`, () => {
    mount(
      <ThemeProvider theme={theme(THEME_LIGHT)}>
        <CssBaseline />
        <ViewSLTHistory shiftData={undefined} updatedList={undefined} />
      </ThemeProvider>,
    );
  });
});
