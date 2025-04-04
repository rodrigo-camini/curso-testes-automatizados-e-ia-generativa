describe('Meal Suggestion App', () => {
    beforeEach(() => {
        cy.visit('https://meal-suggestion.s3.eu-central-1.amazonaws.com/index.html')
    })

    it('carrega uma refeição aleatória ao iniciar', () => {
        cy.get('#meal-name').should('not.be.empty')
        cy.get('#ingredients-label').should('contain.text', 'Ingredientes')
        cy.get('#ingredients-list li').should('have.length.greaterThan', 0)
    })

    it('sugere nova refeição ao clicar no botão de busca vazio', () => {
        cy.get('#meal-name').invoke('text').then(firstMeal => {
            cy.get('#search-container button[type="submit"]').click()
            cy.get('#meal-name').invoke('text').should('not.eq', firstMeal)
        })
    })

    it('filtra por tipo de refeição: salada', () => {
        cy.get('#meal-type-filter').select('salad')
        cy.get('#meal-name').should('contain.text', 'salada')
    })

    it('filtra por tipo de refeição: sopa', () => {
        cy.get('#meal-type-filter').select('soup')
        cy.get('#meal-name').should('contain.text', 'sopa')
    })

    it('filtra por refeições com alto teor de proteína', () => {
        cy.get('#meal-type-filter').select('high-protein')
        cy.get('#meal-name').should('contain.text', 'alto teor de proteína')
    })

    it('exibe refeição ao buscar por nome', () => {
        cy.get('#search-field').type('quinoa')
        cy.get('#meal-name').should('contain.text', 'quinoa')
        cy.get('#ingredients-label').should('contain.text', 'Ingredientes')
        cy.get('#ingredients-list li').should('have.length.greaterThan', 0)
    })

    it('ignora capitalização e espaços extras na busca', () => {
        cy.get('#search-field').type('  QuInOA  ')
        cy.get('#meal-name').should('contain.text', 'quinoa')
    })

    it('limpa o campo de busca após gerar nova refeição', () => {
        cy.get('#search-field').type('arroz')
        cy.get('#search-container button[type="submit"]').click()
        cy.get('#search-field').should('have.value', '')
    })
})
