describe('DistributeurView', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('charge la liste des produits', () => {
    // Vérifie qu’au moins un produit est affiché dans ListeProduits
    cy.get('[data-cy=liste-produits]')
      .children()
      .should('have.length.greaterThan', 0)
  })

  it('permet d’insérer une pièce', () => {

    cy.get('[data-cy=inserer-piece-button]').click()

    cy.get('[data-cy=montant-inseré]').should('exist').and('not.be.empty')
  })

  it('ajoute un produit au panier', () => {
    // Clique sur un bouton "Ajouter au panier" sur un produit
    cy.get('[data-cy=btn-ajouter-panier]').first().click()

    // Vérifie que le panier contient cet item
    cy.get('[data-cy=panier-items]').children().should('have.length.greaterThan', 0)
  })

  it('finalise un achat et navigue vers la confirmation', () => {
    // Simule un achat
    cy.get('[data-cy=btn-finaliser]').click()

    // Soit la navigation vers confirmation
    cy.url().should('include', '/confirmation')

  })
})
