import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../services/theme/theme';
import SLTHistoryTableList from './SLTHistoryTable';
import SLTHistoryMockList from '../../../mockData/SLTHistoryMock';
import SltHistoryDataModel from '../../Models/SLTHistory';


describe('<SLTHistoryTableList />', () => {
  it(`Theme ${THEME_DARK}: Renders SLTHistoryTableList`, () => {
    const mockData: SltHistoryDataModel[] = SLTHistoryMockList;
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <SLTHistoryTableList data={mockData} updateList={undefined} />
      </ThemeProvider>
    );
  });

  it(`Theme ${THEME_LIGHT}: Renders SLTHistoryTableList`, () => {
    const mockData: SltHistoryDataModel[] = SLTHistoryMockList;
    mount(
      <ThemeProvider theme={theme(THEME_LIGHT)}>
        <CssBaseline />
        <SLTHistoryTableList data={mockData} updateList={undefined} />
      </ThemeProvider>
    );
  });
});
