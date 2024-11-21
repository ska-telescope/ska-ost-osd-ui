import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { mount } from 'cypress/react18';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../../services/theme/theme';
import ViewShiftData from './ViewShiftData';
import SHIFT_DATA_LIST from '../../../DataModels/DataFiles/shiftDataList';

const THEME = [THEME_DARK, THEME_LIGHT];

describe('<ViewShiftData />', () => {

  for (const theTheme of THEME) {
    it(`Theme ${theTheme}: Renders ViewShiftData`, () => {
    const mockData = SHIFT_DATA_LIST[0];
    mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <ViewShiftData data={mockData} />
      </ThemeProvider>
    );
    cy.get('#operatorName').should('contain', 'label.operatorName');
    
    cy.get('#shiftStart').should('contain', 'label.shiftStartedAt');
    
    cy.get('#shiftEnd').should('contain', 'label.shiftEndsAt');

    // const testAnnotation = 'Test annotation text';

    // cy.get('[data-testid="addAnnotation"]').should('exist');
    // cy.get('[data-testid="addAnnotation"]').type(testAnnotation);

    cy.get('[data-testid="shiftCommentsHistory"]').should('exist');
    cy.get('[data-testid="shiftCommentsHistory"]').should('contain', 'label.comments');
  });
}
});


//   // it('allows adding annotations when none exist', () => {
//   //   
    
    
    
//   //   cy.get('[data-testid="addAnnotationBtn"]').click();
    
//   //   cy.wait('@updateAnnotation').its('request.body').should('deep.equal', {
//   //     annotations: testAnnotation
//   //   });
    
//   //   cy.get('[data-testid="successStatusMsg"]').should('exist');
//   // });

//   // it('handles editing existing annotations', () => {
//   //   const mockDataWithAnnotation = {
//   //     ...mockData,
//   //     annotations: 'Existing annotation'
//   //   };

//   //   cy.mount(<ViewShiftData data={mockDataWithAnnotation} />);

//   //   cy.get('[data-testid="manageEntityStatus"]').click();
    
//   //   cy.get('[data-testid="updateAnnotation"]').should('have.value', 'Existing annotation');
    
//   //   cy.get('[data-testid="updateAnnotation"]').clear().type('Updated annotation');
//   //   cy.get('[data-testid="commentButton"]').click();
    
//   //   cy.wait('@updateAnnotation');
//   // });

//   // it('handles image modal operations', () => {
//   //   cy.get('[aria-label="dialog"]').should('not.exist');
    
//   //   // Trigger image modal open (you'll need to add a way to trigger this)
//   //   cy.window().then((win) => {
//   //     win.handleOpenImage('123');
//   //   });
    
//   //   cy.wait('@getImages');
    
//   //   cy.get('[aria-label="dialog"]').should('be.visible');
    
//   //   // Close modal
//   //   cy.get('[data-testid="statusClose"]').click();
//   //   cy.get('[aria-label="dialog"]').should('not.exist');
//   // });

//   // it('displays shift comments correctly', () => {
//   //   const mockComment = {
//   //     comment: 'Test comment'
//   //   };

//   //   cy.window().then((win) => {
//   //     win.displayShiftComments(mockComment);
//   //   });

    
//   // });

//   // it('handles error states in image fetching', () => {
//   //   cy.intercept('GET', '**/shift_comments/download_images/*', {
//   //     statusCode: 404
//   //   }).as('getImagesError');

//   //   cy.window().then((win) => {
//   //     win.handleOpenImage('123');
//   //   });

//   //   cy.wait('@getImagesError');
//   //   cy.get('[aria-label="dialog"]').should('be.visible');
//   // });
// });