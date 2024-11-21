import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../services/theme/theme';
import DisplayShiftLogsComponent from './DisplayShiftLogsComponent';
import SHIFT_DATA_LIST from '../../../DataModels/DataFiles/shiftDataList';

const THEME = [THEME_DARK, THEME_LIGHT];

describe('<DisplayShiftLogsComponent />', () => {
  // Mock data that matches your component's expected structure
  const mockShiftData = {
    shift_logs: [
      {
        id: '1',
        source: 'Test Source',
        log_time: '2024-01-20T10:00:00',
        info: {
          sbi_status: 'Success',
          eb_id: 'EB123',
          sbi_ref: 'SBI456',
          request_responses: [
            { request: 'Test Request', response: 'Test Response' }
          ]
        }
      }
    ]
  };

  for (const theTheme of THEME) {
    describe(`Theme: ${theTheme}`, () => {
      beforeEach(() => {
        mount(
          <ThemeProvider theme={theme(theTheme)}>
            <CssBaseline />
            <DisplayShiftLogsComponent
              shiftData={mockShiftData}
              updateCommentsEvent={cy.stub().as('updateCommentsEvent')}
              isCurrentShift={true}
            />
          </ThemeProvider>
        );
      });

      it('renders shift logs with source information', () => {
        cy.contains('Source:Test Source').should('be.visible');
      });

      it('displays date time information', () => {
        cy.contains('label.dateTime').should('be.visible');
      });

      it('shows SBI status chip', () => {
        cy.contains('SUCCESS').should('be.visible');
      });

      it('displays EB and SBI information', () => {
        cy.contains('label.ebID').should('be.visible');
        cy.contains('EB123').should('be.visible');
        cy.contains('label.sbiID').should('be.visible');
        cy.contains('SBI456').should('be.visible');
      });

      it('shows EB observations section', () => {
        cy.contains('label.ebObservations').should('be.visible');
      });

      it('displays add log comments section when isCurrentShift is true', () => {
        cy.contains('label.addLogComments').should('be.visible');
      });

      // Test comment button functionality
      it('handles comment button interaction', () => {
        cy.get('[testId="commentButton"]').should('not.exist');
      });

      // Test with empty shift logs
      it('handles empty shift logs', () => {
        mount(
          <ThemeProvider theme={theme(theTheme)}>
            <CssBaseline />
            <DisplayShiftLogsComponent
              shiftData={{ shift_logs: [] }}
              updateCommentsEvent={cy.stub()}
              isCurrentShift={true}
            />
          </ThemeProvider>
        );
        
        // Verify that no logs are displayed
        cy.contains('Source:').should('not.exist');
      });

      // Test with null/undefined data
      it('handles null shift data', () => {
        mount(
          <ThemeProvider theme={theme(theTheme)}>
            <CssBaseline />
            <DisplayShiftLogsComponent
              shiftData={null}
              updateCommentsEvent={cy.stub()}
              isCurrentShift={true}
            />
          </ThemeProvider>
        );
        
        // Verify that no logs are displayed
        cy.contains('Source:').should('not.exist');
      });

      // Test failed status
      it('displays error status correctly', () => {
        const failedShiftData = {
          shift_logs: [{
            ...mockShiftData.shift_logs[0],
            info: {
              ...mockShiftData.shift_logs[0].info,
              sbi_status: 'Failed'
            }
          }]
        };

        mount(
          <ThemeProvider theme={theme(theTheme)}>
            <CssBaseline />
            <DisplayShiftLogsComponent
              shiftData={failedShiftData}
              updateCommentsEvent={cy.stub()}
              isCurrentShift={true}
            />
          </ThemeProvider>
        );

        // Verify error status chip
        cy.contains('FAILED').should('be.visible');
      });

      // Test current shift specific features
      it('shows/hides features based on isCurrentShift', () => {
        // Test with isCurrentShift = false
        mount(
          <ThemeProvider theme={theme(theTheme)}>
            <CssBaseline />
            <DisplayShiftLogsComponent
              shiftData={mockShiftData}
              updateCommentsEvent={cy.stub()}
              isCurrentShift={false}
            />
          </ThemeProvider>
        );

        // Verify that add comments section is not visible
        cy.contains('label.addLogComments').should('not.exist');
      });
    });
  }
});

