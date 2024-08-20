import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../services/theme/theme';
import SLTLogTableList from './SLTTableList';
import SLTLogMockList from '../../../mockData/SLTLogMock';

describe('<SLTLogTableList />', () => {
  it(`Theme ${THEME_DARK}: Renders SLTLogTableList`, () => {
    const mockData = SLTLogMockList;
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <SLTLogTableList data={mockData} />
      </ThemeProvider>,
    );
  });

  it(`Theme ${THEME_LIGHT}: Renders SLTLogTableList`, () => {
    const mockData = SLTLogMockList;
    mount(
      <ThemeProvider theme={theme(THEME_LIGHT)}>
        <CssBaseline />
        <SLTLogTableList data={mockData} />
      </ThemeProvider>,
    );
  });
});
