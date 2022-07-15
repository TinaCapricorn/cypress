describe('Lesson tests', () => {
    beforeEach(() => {
        cy.visit("/");
    });
    it("Should open the main page", () => {   
        cy.checkVisibility("Books list");
    });
    it("Should successfully login", () => {
        cy.login();
        cy.checkVisibility("Добро пожаловать test@test.com");
    });
    it("Should not login with empty password", () => {
        cy.login(false);
        cy.getPassValidity().should('be.false');
    });
});