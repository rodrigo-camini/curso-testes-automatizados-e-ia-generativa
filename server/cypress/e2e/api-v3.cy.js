describe('API /customers Endpoint', () => {
    const apiUrl = Cypress.env('API_URL') || 'http://localhost:3001/customers'

    context('Successful Requests', () => {
        it('fetches customers with default query parameters', () => {
            // Arrange
            const url = `${apiUrl}`

            // Act
            cy.request('GET', url).then((response) => {
                // Assert
                expect(response.status).to.eq(200)
                const { customers, pageInfo } = response.body
                expect(customers).to.be.an('array')
                customers.forEach(customer => {
                    expect(customer).to.have.all.keys('id', 'name', 'employees', 'contactInfo', 'size', 'industry', 'address')
                    expect(customer.size).to.be.oneOf(['Small', 'Medium', 'Enterprise', 'Large Enterprise', 'Very Large Enterprise'])
                    expect(customer.industry).to.be.oneOf(['Logistics', 'Retail', 'Technology', 'HR', 'Finance'])
                })
                expect(pageInfo).to.have.all.keys('currentPage', 'totalPages', 'totalCustomers')
            })
        })

        it('fetches customers with specific query parameters', () => {
            // Arrange
            const url = `${apiUrl}?page=2&limit=5&size=Medium&industry=Technology`

            // Act
            cy.request('GET', url).then((response) => {
                // Assert
                expect(response.status).to.eq(200)
                const { customers, pageInfo } = response.body
                expect(customers).to.be.an('array')
                customers.forEach(customer => {
                    expect(customer.size).to.eq('Medium')
                    expect(customer.industry).to.eq('Technology')
                })
                expect(pageInfo.currentPage).to.eq(2)
                expect(pageInfo.totalCustomers).to.be.greaterThan(0)
            })
        })
    })

    context('Error Scenarios', () => {
        it('returns 400 for invalid page parameter', () => {
            // Arrange
            const url = `${apiUrl}?page=-1`

            // Act
            cy.request({
                method: 'GET',
                url: url,
                failOnStatusCode: false
            }).then((response) => {
                // Assert
                expect(response.status).to.eq(400)
                expect(response.body.error).to.eq('Invalid page or limit. Both must be positive numbers.')
            })
        })

        it('returns 400 for invalid limit parameter', () => {
            // Arrange
            const url = `${apiUrl}?limit=-1`

            // Act
            cy.request({
                method: 'GET',
                url: url,
                failOnStatusCode: false
            }).then((response) => {
                // Assert
                expect(response.status).to.eq(400)
                expect(response.body.error).to.eq('Invalid page or limit. Both must be positive numbers.')
            })
        })

        it('returns 400 for unsupported size parameter', () => {
            // Arrange
            const url = `${apiUrl}?size=Gigantic`

            // Act
            cy.request({
                method: 'GET',
                url: url,
                failOnStatusCode: false
            }).then((response) => {
                // Assert
                expect(response.status).to.eq(400)
                expect(response.body.error).to.eq('Unsupported size value. Supported values are All, Small, Medium, Enterprise, Large Enterprise, and Very Large Enterprise.')
            })
        })

        it('returns 400 for unsupported industry parameter', () => {
            // Arrange
            const url = `${apiUrl}?industry=Agriculture`

            // Act
            cy.request({
                method: 'GET',
                url: url,
                failOnStatusCode: false
            }).then((response) => {
                // Assert
                expect(response.status).to.eq(400)
                expect(response.body.error).to.eq('Unsupported industry value. Supported values are All, Logistics, Retail, Technology, HR, and Finance.')
            })
        })
    })
})