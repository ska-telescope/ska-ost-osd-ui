export const viewPort = (format = 'pc') => {
  const isPC = () => format === 'pc';
  const xAxis = isPC() ? 1500 : 600;
  const yAxis = isPC() ? 1500 : 600;
  cy.viewport(xAxis, yAxis);
};
