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
        // https://docs.cypress.io/guides/references/best-practices
        // Bad way to get an element. Way to generic. Should never be done. 
        //cy.get('h1').should('have.text', "Login")

        // Best way to isolate an element. Please use this method. 
        cy.get('[data-testid="login-title"]').should('have.text', "Login")
    })
});

describe('Clicking on button', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/')
      })
  
      it("should have a button", () => {
        cy.get('[data-testid="login-button"]')
      })

      it("should display log in", () => {
        cy.get('[data-testid="login-button"]').should("have.text", "LOG IN");
      });

    
})