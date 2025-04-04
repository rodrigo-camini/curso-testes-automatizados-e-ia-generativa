import React from 'react';
import { mount } from 'cypress/react';
import { ThankYouPage } from './ThankYouPage';

describe('ThankYouPage Component', () => {
    it('renders correctly with given props', () => {
        const orderNumber = '12345';
        const onBackToStore = cy.stub();

        mount(<ThankYouPage orderNumber={orderNumber} onBackToStore={onBackToStore} />);

        cy.contains('Thank You for Your Purchase!').should('be.visible');
        cy.contains('Your order has been successfully placed.').should('be.visible');
        cy.contains('Order Number').should('be.visible');
        cy.contains(orderNumber).should('be.visible');
        cy.contains('Back to Store').should('be.visible');
    });

    it('calls onBackToStore when "Back to Store" button is clicked', () => {
        const orderNumber = '12345';
        const onBackToStore = cy.stub();

        mount(<ThankYouPage orderNumber={orderNumber} onBackToStore={onBackToStore} />);

        cy.contains('Back to Store').click();
        cy.wrap(onBackToStore).should('have.been.calledOnce');
    });
});
