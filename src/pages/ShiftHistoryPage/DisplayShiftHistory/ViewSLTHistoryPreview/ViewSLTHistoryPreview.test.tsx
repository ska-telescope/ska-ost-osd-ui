import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../../services/theme/theme';
import SHIFT_DATA_LIST from '../../../../DataModels/DataFiles/shiftDataList';
import ViewSLTHistoryPreview from './ViewSLTHistoryPreview';

describe('<ShiftHistoryListComponent />', () => {
  it(`Theme ${THEME_DARK}: Renders ShiftHistoryListComponent`, () => {
    const mockData = SHIFT_DATA_LIST;
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <ViewSLTHistoryPreview shiftData={mockData} updatedList={undefined} />
      </ThemeProvider>
    );
  });

  it(`Theme ${THEME_LIGHT}: Renders SLTHistoryTableList`, () => {
    const mockData = SHIFT_DATA_LIST;
    mount(
      <ThemeProvider theme={theme(THEME_LIGHT)}>
        <CssBaseline />
        <ViewSLTHistoryPreview shiftData={mockData} updatedList={undefined} />
      </ThemeProvider>
    );
  });
});
