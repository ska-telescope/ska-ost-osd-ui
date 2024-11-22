import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../services/theme/theme';
import ImageDisplayComponent from './ImageDisplayComponent';

describe('<Legend />', () => {
  it(`Theme ${THEME_DARK}: Renders`, () => {
    const imageData = [
      {
        media_content: 'image'
      }
    ];
    cy.mount(
      <ThemeProvider theme={theme(THEME_DARK)}>
        <CssBaseline />
        <ImageDisplayComponent images={imageData[0]} />
      </ThemeProvider>
    );
  });

  it(`Theme ${THEME_LIGHT}: Renders`, () => {
    const imageData = [
      {
        media_content: 'image'
      }
    ];
    cy.mount(
      <ThemeProvider theme={theme(THEME_LIGHT)}>
        <CssBaseline />
        <ImageDisplayComponent images={imageData[0]} />
      </ThemeProvider>
    );
  });
});
