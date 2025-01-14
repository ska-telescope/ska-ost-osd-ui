import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../../services/theme/theme';
import ShiftHistoryListComponent from './ShiftHistoryListComponent';
import SHIFT_DATA_LIST from '../../../../DataModels/DataFiles/ShiftDataList';

describe('ShiftHistoryListComponent Theme Rendering', () => {
  it(`Theme ${THEME_DARK}: Renders ShiftHistoryListComponent`, () => {
    const mockData = SHIFT_DATA_LIST;
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <ShiftHistoryListComponent data={mockData} updateList={undefined} />
      </ThemeProvider>
    );
  });

  it(`Theme ${THEME_LIGHT}: Renders ShiftHistoryListComponent`, () => {
    const mockData = SHIFT_DATA_LIST;
    mount(
      <ThemeProvider theme={theme(THEME_LIGHT)}>
        <CssBaseline />
        <ShiftHistoryListComponent data={mockData} updateList={undefined} />
      </ThemeProvider>
    );
  });
});
