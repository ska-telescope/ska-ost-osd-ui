import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../services/theme/theme';
import Loader from './Loader';
import { mount } from 'cypress/react';

describe('Loader Theme Rendering', () => {
  it(`Theme ${THEME_DARK}: Renders`, () => {
    cy.mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <Loader />
      </ThemeProvider>
    );
  });

  it(`Theme ${THEME_LIGHT}: Renders`, () => {
    cy.mount(
      <ThemeProvider theme={theme(THEME_LIGHT)}>
        <CssBaseline />
        <Loader />
      </ThemeProvider>
    );
  });
});

describe('Loader Component Tests', () => {
  beforeEach(() => {
    mount(<Loader />);
  });

  it('should render the loader component', () => {
    cy.get('[data-testid="progressTestId"]').should('exist');
  });

  it('should render with correct size', () => {
    cy.get('[data-testid="progressTestId"]')
      .should('have.css', 'width', '100px')
      .and('have.css', 'height', '100px');
  });

  it('should be contained within a Box component', () => {
    cy.get('.MuiBox-root').should('exist');
    cy.get('.MuiBox-root').find('[data-testid="progressTestId"]').should('exist');
  });
});
