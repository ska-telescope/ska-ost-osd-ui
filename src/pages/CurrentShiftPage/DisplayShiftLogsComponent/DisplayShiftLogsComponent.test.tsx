/* eslint-disable no-restricted-syntax */
import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../services/theme/theme';
import DisplayShiftLogsComponent from './DisplayShiftLogsComponent';
import { StoreProvider } from '@ska-telescope/ska-gui-local-storage';
import { viewPort } from '../../../utils/constants';
import SHIFT_DATA_LIST from '../../../DataModels/DataFiles/ShiftDataList';

const THEME = [THEME_DARK, THEME_LIGHT];

function mounting(theTheme) {
  viewPort();
  cy.mount(
    <StoreProvider>
      <ThemeProvider theme={theme(theTheme)}>
        <CssBaseline />
        <DisplayShiftLogsComponent
          shiftData={SHIFT_DATA_LIST[0]}
          updateCommentsEvent={cy.stub().as('updateCommentsEvent')}
          isCurrentShift={true}
        />
      </ThemeProvider>
    </StoreProvider>
  );
}

describe('DisplayShiftLogsComponent Theme Rendering', () => {
  for (const theTheme of THEME) {
    it(`Theme ${theTheme}: Renders`, () => {
      mounting(theTheme);
    });
  }
});
