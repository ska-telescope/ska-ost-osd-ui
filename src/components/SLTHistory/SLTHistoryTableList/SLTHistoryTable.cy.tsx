import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../services/theme/theme';
import SLTHistoryTableList from './SLTHistoryTable';
import sltDataModel from '../../Models/sltDataModel';
import sltData from '../../../mockData/sltData';

describe('<SLTHistoryTableList />', () => {
  it(`Theme ${THEME_DARK}: Renders SLTHistoryTableList`, () => {
    const mockData: sltDataModel[] = sltData;
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <SLTHistoryTableList data={mockData} updateList={undefined} />
      </ThemeProvider>
    );
  });

  it(`Theme ${THEME_LIGHT}: Renders SLTHistoryTableList`, () => {
    const mockData: sltDataModel[] = sltData;
    mount(
      <ThemeProvider theme={theme(THEME_LIGHT)}>
        <CssBaseline />
        <SLTHistoryTableList data={mockData} updateList={undefined} />
      </ThemeProvider>
    );
  });
});
