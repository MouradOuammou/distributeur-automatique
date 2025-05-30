/**
 * Configuration globale pour les tests
 * Fichier : src/tests/setup.js
 */

// Configuration de l'environnement de test
process.env.NODE_ENV = 'test';
process.env.PORT = 3001; // Port différent pour les tests
process.env.CORS_ORIGIN = 'http://localhost:3000';

// Configuration des timeouts plus longs si nécessaire
jest.setTimeout(10000);


// Nettoyage après chaque test
afterEach(() => {
  // Nettoyer les mocks si nécessaire
  jest.clearAllMocks();
});

// Configuration console pour les tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;


// Matchers personnalisés (optionnel)
expect.extend({
  toBeValidPrice(received) {
    const pass = typeof received === 'number' && received > 0 && Number.isFinite(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid price`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid price (positive number)`,
        pass: false,
      };
    }
  },
  
  toBeValidCurrency(received) {
    const validCoins = [0.5, 1, 2, 5, 10];
    const pass = validCoins.includes(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid currency`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid currency (${validCoins.join(', ')})`,
        pass: false,
      };
    }
  }
});

// Helper functions pour les tests
global.testHelpers = {
  /**
   * Crée un état de distributeur pour les tests
   */
  createMockDistributorState: (overrides = {}) => ({
    solde: 0,
    produits: [
      { id: 1, nom: "Soda", prix: 3.5, quantite: 10, achetable: false },
      { id: 2, nom: "Chips", prix: 2.0, quantite: 15, achetable: false },
      { id: 3, nom: "Bonbon", prix: 1.5, quantite: 20, achetable: false },
      { id: 4, nom: "Eau", prix: 2.5, quantite: 12, achetable: false }
    ],
    panier: [],
    ...overrides
  }),
  
  /**
   * Simule l'insertion de plusieurs pièces
   */
  insertMultipleCoins: async (request, app, coins) => {
    let lastResponse;
    for (const coin of coins) {
      lastResponse = await request(app)
        .post('/api/pieces')
        .send({ montant: coin })
        .expect(200);
    }
    return lastResponse;
  },
  
  /**
   * Simule l'ajout de plusieurs produits au panier
   */
  addMultipleToCart: async (request, app, productIds) => {
    let lastResponse;
    for (const id of productIds) {
      lastResponse = await request(app)
        .post('/api/panier')
        .send({ idProduit: id })
        .expect(200);
    }
    return lastResponse;
  },
  
  /**
   * Calcule le total d'un panier
   */
  calculateCartTotal: (products) => {
    return products.reduce((total, product) => total + product.prix, 0);
  },
  
  /**
   * Vérifie si un objet représente une erreur API valide
   */
  isValidApiError: (errorResponse) => {
    return errorResponse.body && 
           typeof errorResponse.body.erreur === 'string' && 
           errorResponse.body.erreur.length > 0;
  }
};