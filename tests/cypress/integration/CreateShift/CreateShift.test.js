describe('Creating Shift', () => {
    it('should create a new shift', { jiraKey: 'XTP-75132' }, () => {
        cy.get('[data-testid="manageShift"]').contains(translation.label.manageShift);
        cy.get('[data-testid="historyButton"]').contains(translation.label.history);
        cy.get('[data-testid="operatorName"]').click({ force: true });
        cy.get('[data-testid="operatorName"]').type('DefaultUser');
        cy.get('[data-testid="shiftStartButton"]').contains(translation.label.shiftStart);
        cy.get('[data-testid="shiftStartButton"]').click({ force: true });
    });
})