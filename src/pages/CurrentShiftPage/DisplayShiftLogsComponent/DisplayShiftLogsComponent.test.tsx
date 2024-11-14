import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../services/theme/theme';
import DisplayShiftLogsComponent from './DisplayShiftLogsComponent';
import SHIFT_DATA_LIST from '../../../DataModels/DataFiles/shiftDataList';

describe('<DisplayShiftLogsComponent />', () => {
  it(`Theme ${THEME_DARK}: Renders DisplayShiftLogsComponent`, () => {
    const mockData = SHIFT_DATA_LIST[0];
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <DisplayShiftLogsComponent
          shiftData={mockData}
          updateCommentsEvent={undefined}
          isCurrentShift={undefined}
        />
      </ThemeProvider>
    );
  });

  it(`Theme ${THEME_LIGHT}: Renders DisplayShiftLogsComponent`, () => {
    const mockData = SHIFT_DATA_LIST[0];
    mount(
      <ThemeProvider theme={theme(THEME_LIGHT)}>
        <CssBaseline />
        <DisplayShiftLogsComponent
          shiftData={mockData}
          updateCommentsEvent={undefined}
          isCurrentShift={undefined}
        />
      </ThemeProvider>
    );
  });
});
