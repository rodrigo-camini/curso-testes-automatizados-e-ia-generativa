import { test, expect } from '@playwright/test';

const apiUrl = process.env.API_URL || 'http://localhost:3001/customers';

test.describe('API /customers Endpoint', () => {

  test.describe('Successful Requests', () => {
    test('fetches customers with default query parameters', async ({ request }) => {
      // Arrange
      const url = `${apiUrl}`;

      // Act
      const response = await request.get(url);
      const body = await response.json();

      // Assert
      expect(response.status()).toBe(200);
      const { customers, pageInfo } = body;
      expect(Array.isArray(customers)).toBeTruthy();
      customers.forEach(customer => {
        expect(customer).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String),
          employees: expect.any(Number),
          contactInfo: expect.any(Object),
          size: expect.stringMatching(/^(Small|Medium|Enterprise|Large Enterprise|Very Large Enterprise)$/),
          industry: expect.stringMatching(/^(Logistics|Retail|Technology|HR|Finance)$/),
          address: expect.any(Object),
        });
      });
      expect(pageInfo).toMatchObject({
        currentPage: expect.any(Number),
        totalPages: expect.any(Number),
        totalCustomers: expect.any(Number),
      });
    });

    test('fetches customers with specific query parameters', async ({ request }) => {
      // Arrange
      const url = `${apiUrl}?page=2&limit=5&size=Medium&industry=Technology`;

      // Act
      const response = await request.get(url);
      const body = await response.json();

      // Assert
      expect(response.status()).toBe(200);
      const { customers, pageInfo } = body;
      expect(Array.isArray(customers)).toBeTruthy();
      customers.forEach(customer => {
        expect(customer.size).toBe('Medium');
        expect(customer.industry).toBe('Technology');
      });
      expect(pageInfo.currentPage).toBe(2);
      expect(pageInfo.totalCustomers).toBeGreaterThan(0);
    });
  });

  test.describe('Error Scenarios', () => {
    test('returns 400 for invalid page parameter', async ({ request }) => {
      // Arrange
      const url = `${apiUrl}?page=-1`;

      // Act
      const response = await request.get(url);
      const body = await response.json();

      // Assert
      expect(response.status()).toBe(400);
      expect(body.error).toBe('Invalid page or limit. Both must be positive numbers.');
    });

    test('returns 400 for invalid limit parameter', async ({ request }) => {
      // Arrange
      const url = `${apiUrl}?limit=-1`;

      // Act
      const response = await request.get(url);
      const body = await response.json();

      // Assert
      expect(response.status()).toBe(400);
      expect(body.error).toBe('Invalid page or limit. Both must be positive numbers.');
    });

    test('returns 400 for unsupported size parameter', async ({ request }) => {
      // Arrange
      const url = `${apiUrl}?size=Gigantic`;

      // Act
      const response = await request.get(url);
      const body = await response.json();

      // Assert
      expect(response.status()).toBe(400);
      expect(body.error).toBe('Unsupported size value. Supported values are All, Small, Medium, Enterprise, Large Enterprise, and Very Large Enterprise.');
    });

    test('returns 400 for unsupported industry parameter', async ({ request }) => {
      // Arrange
      const url = `${apiUrl}?industry=Agriculture`;

      // Act
      const response = await request.get(url);
      const body = await response.json();

      // Assert
      expect(response.status()).toBe(400);
      expect(body.error).toBe('Unsupported industry value. Supported values are All, Logistics, Retail, Technology, HR, and Finance.');
    });
  });
});