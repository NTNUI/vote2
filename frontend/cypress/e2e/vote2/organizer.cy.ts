/// <reference types="cypress" />

import { forEach } from "cypress/types/lodash";
import { UserDataResponseType} from "../../../src/types/user"

let organizedGroups = <UserDataResponseType><unknown>[];

beforeEach(() => {
    cy.visit("/");
    cy.get('[data-testid="phone-input"]').type("99994444");
    cy.get('[data-testid="password-input"]').type("SprintIsTheBest");
    cy.get('[data-testid="login-button"]').click();
});

describe("User should be an organizer", () => {
    it("User should be organizer in aleast one group", () => {
        // Always fetches data, prevents 304 response
        cy.intercept('/user/userData', req => {
            delete req.headers['if-none-match']
          }).as('userData')

        // Checks if User is an organizer, and if amount of organized groups above 0
        cy.wait("@userData").then(interception => {
            expect(interception.response.body.isOrganizer).equal(true)
            const groups = interception.response.body.groups
            groups.forEach(group => {
                if(group.organizer) {
                organizedGroups.push(group)
            }
            })
            expect(organizedGroups.length).above(0);
        })        
    })

    it("Organizer button should be visible", () => {
        cy.get('[data-testid="organizer-button"]').should("be.visible").should("have.text", "Organizer")
    })

    it("Organized groups should have the organizer tag in the list", () => {
        organizedGroups.forEach(group  => {
            const testId = '[data-testid="group-'.concat(group.groupSlug).concat('"]')
            cy.get(testId).should("have.text", group.groupSlug.toUpperCase()+"Organizer")
        })
    })

    it("Organizerlist should contain all groups where User is organizer", () => {
        cy.get('[data-testid="organizer-button"]').click()
        organizedGroups.forEach(group  => {
            const testId = '[data-testid="'+group.groupSlug+'-box"]'
            cy.get(testId).should("contain.text", group.groupName)
        })
    })
})  