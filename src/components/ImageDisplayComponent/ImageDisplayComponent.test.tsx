import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME_DARK, THEME_LIGHT } from '@ska-telescope/ska-gui-components';
import theme from '../../services/theme/theme';
import ImageDisplayComponent from './ImageDisplayComponent';
import { mount } from 'cypress/react';

describe('ImageDisplayComponent Theme Rendering', () => {
  beforeEach(() => {
    cy.stub(require('react-i18next'), 'useTranslation').returns({
      t: (key) => (key === 'label.noImageFound' ? 'No images found' : key)
    });
  });

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

  it('should display loading message when images array is empty', () => {
    mount(<ImageDisplayComponent images={[]} />);
    cy.contains('Loading please wait...').should('be.visible');
  });

  it('should render images correctly when valid image data is provided', () => {
    const images = [
      {
        media_content: 'base64EncodedImage1',
        isEmpty: false
      },
      {
        media_content: 'base64EncodedImage2',
        isEmpty: false
      }
    ];

    mount(<ImageDisplayComponent images={images} />);

    cy.get('img').should('have.length', 2);

    cy.get('img').each(($img, index) => {
      cy.wrap($img)
        .should('have.attr', 'src')
        .and('include', `data:image/jpg;base64,${images[index].media_content}`);

      cy.wrap($img).should('have.attr', 'alt').and('equal', `Image${index}`);
    });
    cy.get('hr').should('have.length', 2);
  });
});
