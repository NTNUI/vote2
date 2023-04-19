/// <reference types="cypress" />
beforeEach(() => {
    cy.visit('/')
})

describe("Checking that all elements are present", () => {
    it("should have a country selection, phonenumber, password and loginbutton", () => {
        cy.get('[data-testid="country-select"]');
        cy.get('[data-testid="phone-input"]');
        cy.get('[data-testid="password-input"]');
        cy.get('[data-testid="login-button"]');
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
        cy.get('[data-testid="username-greeting-text"]').should(
            "have.text",
            "Hello Sprint!"
        );
    });
})
describe("Logging out", () => {
    it("should be able to logout after logging in", () => {
        cy.get('[data-testid="phone-input"]').type("99994444");
        cy.get('[data-testid="password-input"]').type("SprintIsTheBest");
        cy.get('[data-testid="login-button"]').click();
        cy.get('[data-testid="username-greeting-text"]').should(
            "have.text",
            "Hello Sprint!"
        );
        cy.get('[data-testid="logout-button"]').click();
        cy.get('[data-testid="login-button"]').should("have.text", "Log in");
    })
    it("should not be able to get to the start page after logging out", () => {
        cy.visit("/start");
        cy.url().should('not.contain', '/start')
    })
});