import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../services/theme/theme';
import ViewShiftData from './ViewShiftData';
import SHIFT_DATA_LIST from '../../../DataModels/DataFiles/shiftDataList';

describe('<ViewShiftData />', () => {
  it(`Theme ${THEME_DARK}: Renders ViewShiftData`, () => {
    const mockData = SHIFT_DATA_LIST[0];
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <ViewShiftData data={mockData} />
      </ThemeProvider>
    );
  });

  it(`Theme ${THEME_LIGHT}: Renders ViewShiftData`, () => {
    const mockData = SHIFT_DATA_LIST[0];
    mount(
      <ThemeProvider theme={theme(THEME_LIGHT)}>
        <CssBaseline />
        <ViewShiftData data={mockData} />
      </ThemeProvider>
    );
  });
});
