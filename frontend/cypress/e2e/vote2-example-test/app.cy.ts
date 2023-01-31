/// <reference types="cypress" />

/*
    Basic example showing how to use Cypress. 
    Visit https://docs.cypress.io/guides/overview/why-cypress to learn more. 
*/

describe('Check for text', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/')
    })
  
    it('displays a title', () => {
        // Bad way to get an element. Way to generic. Should never be done. 
        cy.get('h1').should('have.text', "Vite + React")

        // Best way to isolate an element. Please use this method. 
        cy.get('[data-cy="header-title"]').should('have.text', "Vite + React")
    })
});

describe('Clicking on button', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/')
      })
  
      it("should have a button", () => {
        cy.get('[data-cy="button-counter"]')
      })

      it("should display count 0", () => {
        cy.get('[data-cy="button-counter"]').should('have.text', "count is 0");
      });

      it("should display count 1 after clicking one time", () => {
        cy.get('[data-cy="button-counter"]').click();
        cy.get('[data-cy="button-counter"]').should('have.text', "count is 1");

      })
})