describe('ConfirmationView', () => {
  beforeEach(() => {
    cy.visit('/confirmation')
  })

  it('affiche un message si aucune transaction', () => {
    cy.get('[data-cy=no-transaction]').should('exist')
    cy.get('[data-cy=no-transaction]').contains('Aucune transaction trouvée')
    cy.get('[data-cy=no-transaction]').contains('Vous allez être redirigé')
  })

  it('bouton retour redirige vers l\'accueil', () => {
    cy.get('[data-cy=btn-retour-accueil]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
