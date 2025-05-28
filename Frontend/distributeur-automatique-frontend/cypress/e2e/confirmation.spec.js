describe('ConfirmationView', () => {
  beforeEach(() => {
    cy.visit('/confirmation')
  })

  it('affiche un message si aucune transaction', () => {
    cy.get('[data-cy=no-transaction]').should('exist')
    cy.get('[data-cy=no-transaction]').contains('Aucune transaction trouvée')
    cy.get('[data-cy=no-transaction]').contains('Vous allez être redirigé')
  })

  it('affiche les détails de la transaction si présente', () => {

    cy.get('[data-cy=transaction-info]').should('exist')
    cy.get('[data-cy=produits-distribues]').children('[data-cy=produit-item]').should('have.length.greaterThan', 0)
     cy.get('[data-cy=total-paye]').should('contain.text', 'Total payé')
  })

  it('bouton retour redirige vers l\'accueil', () => {
    cy.get('[data-cy=btn-retour-accueil]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
