import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../services/theme/theme';
import DisplayShiftLogsComponent from './DisplayShiftLogsComponent';
import SHIFT_DATA_LIST from '../../../DataModels/DataFiles/shiftDataList';

const THEME = [THEME_DARK, THEME_LIGHT];

describe('<DisplayShiftLogsComponent />', () => {

  for (const theTheme of THEME) {
  it(`Theme ${theTheme}: Renders DisplayShiftLogsComponent`, () => {
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

}
});
