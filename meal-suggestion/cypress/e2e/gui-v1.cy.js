describe('Meal Suggestion App', () => {
  beforeEach(() => {
    cy.visit('https://meal-suggestion.s3.eu-central-1.amazonaws.com/index.html');
  });

  it('should load the page successfully', () => {
    cy.contains('Refeição vegana').should('be.visible');
  });

  it('should generate a meal suggestion when button is clicked', () => {
    cy.get('button').contains('Buscar').click();
    cy.get('#meal-name').should('not.be.empty');
    cy.get('#ingredients-list').should('not.be.empty');
  });

  it('should display a different meal on multiple clicks', () => {
    let firstMeal;

    cy.get('button').contains('Buscar').click();
    cy.get('#meal-name')
      .invoke('text')
      .then((text) => {
        firstMeal = text;
      });

    cy.get('button').contains('Buscar').click();
    cy.get('#meal-name').should('not.have.text', firstMeal);
  });

});
