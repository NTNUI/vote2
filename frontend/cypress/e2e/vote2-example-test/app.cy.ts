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
  cy.visit("http://localhost:5173/");
});

describe("Checking that all elements are present", () => {
  it("should have a phonenumber field", () => {
    cy.get('[data-testid="phone-input"]');
  });

  it("should have a country selection", () => {
    cy.get('[data-testid="country-select"]');
  });

  it("should have a password field", () => {
    cy.get('[data-testid="password-input"]');
  });

  it("should have a button", () => {
    cy.get('[data-testid="login-button"]');
  });

  it("button should display log in", () => {
    cy.get('[data-testid="login-button"]').should("have.text", "Log in");
  });
});

describe("Inputting user credentials", () => {
  it("should display an error when inputting incorrect credentials", () => {
    cy.get('[data-testid="phone-input"]').type("12345678");
    cy.get('[data-testid="password-input"]').type("TotallyIncorrectPassword");
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="bad-login-notification"]').should("be.visible");
  });

  it("should login when input correct credentials", () => {
    cy.get('[data-testid="phone-input"]').type("99994444");
    cy.get('[data-testid="password-input"]').type("SprintIsTheBest");
    cy.get('[data-testid="login-button"]').click();
    cy.wait(1000);
    cy.get('[data-testid="start-page-title"]').should(
      "have.text",
      "Start page"
    );
  });

  it("should be able to logout after logging in", () => {
    cy.get('[data-testid="phone-input"]').type("99994444");
    cy.get('[data-testid="password-input"]').type("SprintIsTheBest");
    cy.get('[data-testid="login-button"]').click();
    cy.wait(1000);
    cy.get('[data-testid="start-page-title"]').should(
      "have.text",
      "Start page"
    );
    cy.get('[data-testid="logout-button"]').click();
    cy.wait(1000);
    cy.get('[data-testid="login-button"]').should("have.text", "Log in");
  });
});
