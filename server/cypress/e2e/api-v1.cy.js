describe('API Tests for /customers endpoint', () => {

  const baseUrl = 'http://localhost:3001/customers';

  it('should return a list of customers with default parameters', () => {
    cy.request({
      method: 'GET',
      url: baseUrl
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('customers');
      expect(response.body.customers).to.be.an('array');
      expect(response.body).to.have.property('pageInfo');
      expect(response.body.pageInfo).to.have.property('currentPage', 1);
      expect(response.body.pageInfo).to.have.property('totalPages');
      expect(response.body.pageInfo).to.have.property('totalCustomers');
    });
  });

  it('should return a list of customers with specified page and limit', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}?page=2&limit=5`
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('customers');
      expect(response.body.customers).to.be.an('array').and.to.have.lengthOf(5);
      expect(response.body).to.have.property('pageInfo');
      expect(response.body.pageInfo).to.have.property('currentPage', 2);
      expect(response.body.pageInfo).to.have.property('totalPages');
      expect(response.body.pageInfo).to.have.property('totalCustomers');
    });
  });

  it('should filter customers by size', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}?size=Medium`
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('customers');
      expect(response.body.customers).to.be.an('array');
      response.body.customers.forEach((customer) => {
        expect(customer).to.have.property('size', 'Medium');
      });
      expect(response.body).to.have.property('pageInfo');
      expect(response.body.pageInfo).to.have.property('currentPage', 1);
      expect(response.body.pageInfo).to.have.property('totalPages');
      expect(response.body.pageInfo).to.have.property('totalCustomers');
    });
  });

  it('should filter customers by industry', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}?industry=Technology`
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('customers');
      expect(response.body.customers).to.be.an('array');
      response.body.customers.forEach((customer) => {
        expect(customer).to.have.property('industry', 'Technology');
      });
      expect(response.body).to.have.property('pageInfo');
      expect(response.body.pageInfo).to.have.property('currentPage', 1);
      expect(response.body.pageInfo).to.have.property('totalPages');
      expect(response.body.pageInfo).to.have.property('totalCustomers');
    });
  });

  it('should return 400 Bad Request for invalid query parameters', () => {
    const invalidParams = [
      { query: 'page=-1', description: 'negative page number' },
      { query: 'limit=abc', description: 'non-numeric limit' },
      { query: 'size=Unknown', description: 'unsupported size value' },
      { query: 'industry=Unknown', description: 'unsupported industry value' }
    ];

    invalidParams.forEach((param) => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}?${param.query}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400, `Failed for ${param.description}`);
      });
    });
  });

});