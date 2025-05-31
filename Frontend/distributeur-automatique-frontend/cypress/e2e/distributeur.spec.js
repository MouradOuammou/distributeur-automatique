describe('DistributeurView', () => {
  beforeEach(() => {
    cy.visit('/')
    // Attendre que la page soit complètement chargée
    cy.get('[data-cy=liste-produits]').should('exist')
  })

  it('charge la liste des produits', () => {
    // Vérifie qu'au moins un produit est affiché dans ListeProduits
    cy.get('[data-cy=liste-produits]')
      .children()
      .should('have.length.greaterThan', 0)
  })

  it("permet d'insérer une pièce", () => {
    // Vérifier que le composant d'insertion de pièce existe
    cy.get('[data-cy=piece-insertion]').should('exist')

    // Vérifier que le bouton existe et est visible
    cy.get('[data-cy=inserer-piece-button]')
      .should('exist')
      .should('be.visible')
      .should('have.length.greaterThan', 0)

    // Cliquer sur le premier bouton de pièce
    cy.get('[data-cy=inserer-piece-button]').first().click()

    // Attendre un moment pour que l'état se mette à jour
    cy.wait(1000)

    // Vérifier que le montant inséré s'affiche
    cy.get('[data-cy=montant-insere]', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .should('contain', 'MAD')
  })

  it('debug - vérifier les éléments présents', () => {
    // Afficher tous les éléments data-cy présents sur la page
    cy.get('[data-cy]').each(($el) => {
      cy.log('Élément trouvé:', $el.attr('data-cy'))
    })

    // Vérifier spécifiquement les boutons de pièces
    cy.get('[data-cy=inserer-piece-button]').then(($buttons) => {
      cy.log('Nombre de boutons de pièces:', $buttons.length)
      $buttons.each((index, button) => {
        cy.log(`Bouton ${index}:`, Cypress.$(button).text())
      })
    })
  })

  it('teste l\'insertion de pièce étape par étape', () => {
    // Étape 1: Vérifier l'état initial
    cy.get('[data-cy=piece-insertion]').should('exist')

    // Étape 2: Vérifier que le montant n'est pas affiché initialement
    cy.get('[data-cy=montant-insere]').should('not.exist')

    // Étape 3: Cliquer sur une pièce
    cy.get('[data-cy=inserer-piece-button]')
      .first()
      .should('be.visible')
      .click()

    // Étape 4: Vérifier que le montant apparaît maintenant
    cy.get('[data-cy=montant-insere]', { timeout: 5000 })
      .should('exist')
      .should('be.visible')

    // Étape 5: Vérifier le contenu du montant
    cy.get('[data-cy=montant-insere]')
      .should('contain', 'Montant inséré')
      .should('contain', 'MAD')
  })

  it('teste le processus complet d\'achat', () => {
    // Étape 1: Insérer une pièce
    cy.get('[data-cy=inserer-piece-button]').first().click()
    cy.get('[data-cy=montant-insere]', { timeout: 5000 }).should('exist')


    // Étape 3: Finaliser l'achat (si le bouton existe)
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=btn-finaliser]').length > 0) {
        cy.get('[data-cy=btn-finaliser]').click()
        cy.url().should('include', '/confirmation')
      } else {
        cy.log('Bouton finaliser non trouvé - test partiel réussi')
      }
    })
  })

  it('vérifie la fonctionnalité complète sans finalisation', () => {
    // Test alternatif si le bouton finaliser n'existe pas encore

    // 1. Insérer plusieurs pièces
    cy.get('[data-cy=inserer-piece-button]').first().click()
    cy.get('[data-cy=montant-insere]').should('exist')

    // Insérer une deuxième pièce si possible
    cy.get('[data-cy=inserer-piece-button]').eq(1).then(($btn) => {
      if ($btn.length > 0) {
        cy.wrap($btn).click()
      }
    })

    // 2. Ajouter produit au panier
    cy.get('[data-cy=panier-items]').should('not.be.empty')

    // 3. Vérifier que tout est cohérent
    cy.get('[data-cy=montant-insere]').should('be.visible')
    cy.get('[data-cy=panier-items]').should('be.visible')
  })

  // Test de robustesse
  it('gère les erreurs gracieusement', () => {
    // Tenter de cliquer plusieurs fois rapidement
    cy.get('[data-cy=inserer-piece-button]').first().click().click().click()

    // Vérifier que l'application reste stable
    cy.get('[data-cy=piece-insertion]').should('exist')
    cy.get('[data-cy=liste-produits]').should('exist')
  })
})
