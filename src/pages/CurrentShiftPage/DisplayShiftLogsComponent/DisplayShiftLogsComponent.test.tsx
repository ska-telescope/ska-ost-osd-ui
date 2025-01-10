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

describe('<DisplayShiftLogsComponent />', () => {
  for (const theTheme of THEME) {
    it(`Theme ${theTheme}: Renders`, () => {
      mounting(theTheme);
    });
  }
});

describe('<DisplayShiftLogsComponent />', () => {
  const waitTime = 5000;
  beforeEach(() => {
    mounting(THEME[1]);
  });

  beforeEach(() => {
    const data = [...SHIFT_DATA_LIST[0].shift_logs[0]['comments']];
    cy.intercept(
      'POST',
      'http://127.0.0.1:8000/ska-oso-slt-services/slt/api/v0/shift_log_comments',
      {
        statusCode: 200,
        body: { ...data }
      }
    ).as('postComment');
  });
  beforeEach(() => {
    const data = [...SHIFT_DATA_LIST[0].shift_logs[0]['comments']];
    cy.intercept(
      'PUT',
      'http://127.0.0.1:8000/ska-oso-slt-services/slt/api/v0/shift_log_comments/1',
      {
        statusCode: 200,
        body: { ...data }
      }
    ).as('putComment');
  });
  it('shiftStartButton', () => {
    cy.get('body').then((element) => {
      if (element.find('[data-testid="shiftLogDisplay"]').length) {
        cy.get('[data-testid="logComment0"]').type('This is dummy log comments');
        cy.get('[data-testid="commentButtonSave0"]').click({ force: true });
        cy.wait('@postComment');
        cy.get('[data-testid="successStatusMsg"]').contains('msg.commentSubmit');
        cy.get('[data-testid="editShiftLogs00"]').click({ force: true });
        cy.get('[data-testid="commentButtonUpdate0"]').click({ force: true });
        cy.wait('@putComment');
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(waitTime);
        cy.get('[data-testid="logImage0ChooseButton"]').click({ force: true });
      }
    });
  });
});
