describe('API Tests for /customers endpoint', () => {
    const apiUrl = Cypress.env('apiUrl')

    it('GET customers with valid parameters', () => {
        cy.request('GET', `${apiUrl}/customers?page=2&limit=10&size=Medium&industry=Technology`)
            .then((response) => {
                const { status, body } = response
                expect(status).to.equal(200)

                const { customers, pageInfo } = body
                expect(customers).to.be.an('array')
                expect(pageInfo).to.have.property('currentPage', 2)
                expect(pageInfo).to.have.property('totalPages')
                expect(pageInfo).to.have.property('totalCustomers')
            })
    })

    it('GET customers with default parameters', () => {
        cy.request('GET', `${apiUrl}/customers`)
            .then((response) => {
                const { status, body } = response
                expect(status).to.equal(200)

                const { customers, pageInfo } = body
                expect(customers).to.be.an('array')
                expect(pageInfo).to.have.property('currentPage', 1)
                expect(pageInfo).to.have.property('totalPages')
                expect(pageInfo).to.have.property('totalCustomers')
            })
    })

    it('GET customers with invalid page parameter', () => {
        cy.request({
            method: 'GET',
            url: `${apiUrl}/customers?page=-1`,
            failOnStatusCode: false
        }).then((response) => {
            const { status } = response
            expect(status).to.equal(400)
        })
    })

    it('GET customers with invalid limit parameter', () => {
        cy.request({
            method: 'GET',
            url: `${apiUrl}/customers?limit=-10`,
            failOnStatusCode: false
        }).then((response) => {
            const { status } = response
            expect(status).to.equal(400)
        })
    })

    it('GET customers with invalid size parameter', () => {
        cy.request({
            method: 'GET',
            url: `${apiUrl}/customers?size=UnknownSize`,
            failOnStatusCode: false
        }).then((response) => {
            const { status } = response
            expect(status).to.equal(400)
        })
    })

    it('GET customers with invalid industry parameter', () => {
        cy.request({
            method: 'GET',
            url: `${apiUrl}/customers?industry=UnknownIndustry`,
            failOnStatusCode: false
        }).then((response) => {
            const { status } = response
            expect(status).to.equal(400)
        })
    })
})