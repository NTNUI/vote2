/// <reference types="cypress" />

beforeEach(() => {
  cy.visit("/");
  cy.get('[data-testid="phone-input"]').type("99994444");
  cy.get('[data-testid="password-input"]').type("SprintIsTheBest");
  cy.get('[data-testid="login-button"]').click();
});

describe("Checking that all elements are present", () => {
  it("should have a clickable organizer button", () => {
    cy.get('[data-testid="organizer-button"]')
      .should("have.text", "Organizer")
      .click();
  });
  it("should have an creatable assembly", () => {
    cy.intercept("DELETE", "assembly").as("deleteAssembly");
    cy.intercept("POST", "assembly/create").as("createAssembly");
    cy.get('[data-testid="organizer-button"]').click();
    cy.get('[data-testid="create-assembly-button-sprint-0"]')
      .should("have.text", "Create assembly")
      .click();
    cy.wait("@createAssembly").its("response.statusCode").should("eq", 200);
    cy.get('[data-testid="edit-assembly-banner"]').should(
      "have.text",
      "EDIT SPRINT ASSEMBLY"
    );
    cy.get('[data-testid="no-cases-warning"]').should(
      "have.text",
      "There are currently no cases"
    );
    cy.get('[data-testid="open-delete-modal"]').click();
    cy.get('[data-testid="delete-button"]').click();
    cy.wait("@deleteAssembly").its("response.statusCode").should("eq", 200);
  });
  it("should add new case", () => {
    cy.intercept("POST", "votation/allvotations").as("getVotations");
    cy.intercept("POST", "assembly/create").as("createAssembly");
    cy.intercept("POST", "votation/create").as("createVotation");

    cy.get('[data-testid="organizer-button"]').click();
    cy.get('[data-testid="create-assembly-button-sprint-0"]')
      .should("have.text", "Create assembly")
      .click();
    cy.wait("@createAssembly").its("response.statusCode").should("eq", 200);
    cy.wait("@getVotations").its("response.statusCode").should("eq", 200);

    cy.get('[data-testid="add-case-button"]')
      .should("have.text", "Add case")
      .click();
    cy.get('[data-testid="caseNumberInput"]').should("have.value", "0.10");
    cy.get('[data-testid="caseNumberInput"]').clear().type("1.0");
    cy.get('[data-testid="caseNumberInput"]').should("have.value", "1.0");
    cy.get('[data-testid="titleInput"]').clear().type("Test Title");
    cy.get('[data-testid="descriptionEdit"]').clear().type("Test Description");
    cy.get('[data-testid="multiselectOptions"]').type(
      "{downArrow}{enter}{downArrow}{enter}{enter}"
    );
    cy.get('[data-testid="submitButton"]').click();
    cy.wait("@createVotation").its("response.statusCode").should("eq", 200);
  });
  it("should edit already created assembly and votation", () => {
    cy.intercept("POST", "votation/allvotations").as("getVotations");
    cy.intercept("PUT", "votation").as("editVotation");

    cy.get('[data-testid="organizer-button"]').click();
    cy.get('[data-testid="edit-assembly-button-sprint"]')
      .should("have.text", "Edit")
      .click();
    cy.wait("@getVotations").its("response.statusCode").should("eq", 200);
    cy.contains("1 - Test Title").click();
    cy.get('[data-testid="title-field"]').should("have.text", "Test Title");

    cy.get('[data-testid="edit-case-button"]')
      .should("have.text", "Edit")
      .click();
    cy.get('[data-testid="titleInput"]').clear().type("New Title");
    cy.get('[data-testid="submitButton"]').click();
    cy.wait("@editVotation").its("response.statusCode").should("eq", 200);
    cy.get('[data-testid="title-field"]').should("have.text", "New Title");
  });

  //Cleanup after tests
  after(() => {
    cy.get('[data-testid="open-delete-modal"]').click();
    cy.get('[data-testid="delete-button"]').click();
  });
});
