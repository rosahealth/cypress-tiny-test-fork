describe("page", () => {
  it("works", () => {
    cy.visit("http://localhost:4200/");
    cy.get("input").type("t");
    cy.get("ui-option").then((el) => {
      expect(Cypress.dom.isVisible(el[8])).to.be.false;
    });
  });
});
