/// <reference types="cypress" />

/*
    Basic example showing how to use Cypress. 
    Visit https://docs.cypress.io/guides/overview/why-cypress to learn more. 
*/

/* describe('Check for text', () => {
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
}); */
beforeEach(() => {
  cy.visit("http://localhost:5173");
  cy.get('[data-testid="phone-input"]').type("99994444");
  cy.get('[data-testid="password-input"]').type("SprintIsTheBest");
  cy.get('[data-testid="login-button"]').click();
  cy.wait(1000);
});

describe("Should be able to access organizer-list", () => {
  it("should login when input correct credentials", () => {
    cy.visit("http://localhost:5173/admin");
    cy.get('[data-testid="organizer-list-page-title"]').should(
      "have.text",
      "Manage group assemblies"
    );
  });
});

describe("Should be able to create an assembly", () => {
  it("should be able to click on create assembly", () => {
    cy.visit("http://localhost:5173/admin");
    cy.get('[data-testid="create-assembly-button-sprint-1"]').click();
    cy.wait(1000);
    cy.get('[data-testid="assembly-title"]').should(
      "have.text",
      "Assembly dashboard"
    );
  });
});
