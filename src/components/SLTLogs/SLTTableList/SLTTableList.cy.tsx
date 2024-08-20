import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../services/theme/theme';
import SLTLogTableList from './SLTTableList';
import SLTLogMockList from '../../../mockData/SLTLogMock';

const THEME = [THEME_DARK, THEME_LIGHT];

describe('<SLTLogTableList />', () => {
  for (const theTheme of THEME) {
    it(`Theme ${theTheme}: Renders SLTLogTableList`, () => {
      const mockData = SLTLogMockList;
      mount(
        <ThemeProvider theme={theme(theTheme)}>
          <CssBaseline />
          <SLTLogTableList data={mockData}  />
        </ThemeProvider>
      );
    });
  }
});
