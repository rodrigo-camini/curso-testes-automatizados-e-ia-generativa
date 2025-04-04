describe('Meal Suggestion App', () => {
    beforeEach(() => {
        cy.visit('https://meal-suggestion.s3.eu-central-1.amazonaws.com/index.html');
    });

    it('should load the page successfully', () => {
        cy.contains('Refeição vegana').should('be.visible');
    });

    it('should allow selecting meal type from dropdown', () => {
        cy.get('select').should('be.visible').select('Todos');
    });

    it('should allow searching for a Sorvete caseiro meal', () => {
        cy.get('input[placeholder="Ex: Arroz e feijão"]').type('Sorvete caseiro');
        cy.get('button').contains('Buscar').click();
        cy.contains('Sorvete caseiro').should('be.visible');
        cy.contains('Ingredientes').should('be.visible');
        cy.contains('banana congelada').should('be.visible');
        cy.contains('proteína em pó').should('be.visible');
        cy.contains('leite vegetal').should('be.visible');
        cy.contains('chia').should('be.visible');
        cy.contains('outras frutas (opcional)').should('be.visible');
    });
});
