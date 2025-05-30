/**
 * Tests d'intégration pour l'API REST du distributeur
 * Utilise Supertest pour tester les endpoints HTTP
 */

const request = require('supertest');
const app = require('../../app');

describe('API Distributeur - Tests d\'intégration', () => {

  describe('GET /api - Obtenir l\'état', () => {
    test('doit retourner l\'état initial du distributeur', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body).toHaveProperty('solde', 0);
      expect(response.body).toHaveProperty('produits');
      expect(response.body).toHaveProperty('panier');
      expect(response.body.produits).toHaveLength(4);
      expect(response.body.panier).toHaveLength(0);
    });

    test('doit retourner la structure correcte des produits', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      response.body.produits.forEach(produit => {
        expect(produit).toHaveProperty('id');
        expect(produit).toHaveProperty('nom');
        expect(produit).toHaveProperty('prix');
        expect(produit).toHaveProperty('quantite');
        expect(produit).toHaveProperty('achetable');
        expect(typeof produit.id).toBe('number');
        expect(typeof produit.nom).toBe('string');
        expect(typeof produit.prix).toBe('number');
        expect(typeof produit.quantite).toBe('number');
        expect(typeof produit.achetable).toBe('boolean');
      });
    });
  });

  describe('POST /api/pieces - Insérer une pièce', () => {
    test('doit accepter une pièce valide', async () => {
      const response = await request(app)
        .post('/api/pieces')
        .send({ montant: 5 })
        .expect(200);

      expect(response.body.solde).toBe(5);
      expect(response.body.produits.some(p => p.achetable)).toBe(true);
    });

    test('doit cumuler plusieurs pièces', async () => {
      // Pre pièce
      await request(app)
        .post('/api/pieces')
        .send({ montant: 2 })
        .expect(200);

      // Deu pièce
      const response = await request(app)
        .post('/api/pieces')
        .send({ montant: 1 })
        .expect(200);

      expect(response.body.solde).toBe(3);
    });

    test('doit rejeter une pièce non acceptée', async () => {
      const response = await request(app)
        .post('/api/pieces')
        .send({ montant: 3 })
        .expect(400);

      expect(response.body).toHaveProperty('erreur');
      expect(response.body.erreur).toContain('Pièce non acceptée');
    });

    test('doit rejeter un montant invalide', async () => {
      const response = await request(app)
        .post('/api/pieces')
        .send({ montant: 'invalid' })
        .expect(400);

      expect(response.body).toHaveProperty('erreur');
      expect(response.body.erreur).toContain('Montant invalide');
    });

    test('doit rejeter une requête sans montant', async () => {
      const response = await request(app)
        .post('/api/pieces')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('erreur');
      expect(response.body.erreur).toContain('Montant invalide');
    });

    test('doit gérer les pièces décimales', async () => {
      const response = await request(app)
        .post('/api/pieces')
        .send({ montant: 0.5 })
        .expect(200);

      expect(response.body.solde).toBe(0.5);
    });
  });

  describe('POST /api/panier - Ajouter au panier', () => {
    beforeEach(async () => {
      // Ajouter du solde avant chaque test
      await request(app)
        .post('/api/pieces')
        .send({ montant: 10 });
    });

    test('doit ajouter un produit valide au panier', async () => {
      const response = await request(app)
        .post('/api/panier')
        .send({ idProduit: 1 }) // Soda
        .expect(200);

      expect(response.body.panier).toHaveLength(1);
      expect(response.body.panier[0].nom).toBe('Soda');
      expect(response.body.solde).toBe(6.5); // 10 - 3.5
    });

    test('doit permettre plusieurs produits dans le panier', async () => {
      // Pre produit
      await request(app)
        .post('/api/panier')
        .send({ idProduit: 1 }); 

      // Deux produit
      const response = await request(app)
        .post('/api/panier')
        .send({ idProduit: 2 })
        .expect(200);

      expect(response.body.panier).toHaveLength(2);
      expect(response.body.solde).toBe(4.5); 
    });

    test('doit rejeter un produit inexistant', async () => {
      const response = await request(app)
        .post('/api/panier')
        .send({ idProduit: 99 })
        .expect(400);

      expect(response.body).toHaveProperty('erreur');
      expect(response.body.erreur).toContain('Produit non trouvé');
    });

    test('doit rejeter si solde insuffisant', async () => {
      await request(app).post('/api/annuler');
      await request(app)
        .post('/api/pieces')
        .send({ montant: 1 });

      const response = await request(app)
        .post('/api/panier')
        .send({ idProduit: 1 }) 
        .expect(400);

      expect(response.body.erreur).toContain('Solde insuffisant');
    });

    test('doit rejeter une requête sans idProduit', async () => {
      const response = await request(app)
        .post('/api/panier')
        .send({})
        .expect(400);

      expect(response.body.erreur).toContain('id produit manquant');
    });

    test('doit décrémenter le stock du produit', async () => {
      // Obtenir le stock initial
      const etatInitial = await request(app).get('/api');
      const stockInitial = etatInitial.body.produits.find(p => p.id === 1).quantite;

      // Acheter le produit
      const response = await request(app)
        .post('/api/panier')
        .send({ idProduit: 1 })
        .expect(200);

      const stockFinal = response.body.produits.find(p => p.id === 1).quantite;
      expect(stockFinal).toBe(stockInitial - 1);
    });
  });

  describe('POST /api/annuler - Annuler la transaction', () => {
    test('doit annuler une transaction avec remboursement', async () => {
      // Préparer une transaction
      await request(app)
        .post('/api/pieces')
        .send({ montant: 10 });
      
      await request(app)
        .post('/api/panier')
        .send({ idProduit: 1 }); // Soda - 3.5

      // Annuler
      const response = await request(app)
        .post('/api/annuler')
        .expect(200);

      expect(response.body).toHaveProperty('remboursement', 6.5);
      expect(response.body.solde).toBe(0);
      expect(response.body.panier).toHaveLength(0);
    });

    test('doit restaurer le stock des produits annulés', async () => {
      // Obtenir l'état initial
      const etatInitial = await request(app).get('/api');
      const stockInitial = etatInitial.body.produits.find(p => p.id === 1).quantite;

      // Faire des achats
      await request(app)
        .post('/api/pieces')
        .send({ montant: 10 });
      
      await request(app)
        .post('/api/panier')
        .send({ idProduit: 1 }); // Soda

      // Annuler
      const response = await request(app)
        .post('/api/annuler')
        .expect(200);

      const stockFinal = response.body.produits.find(p => p.id === 1).quantite;
      expect(stockFinal).toBe(stockInitial);
    });

    test('doit gérer l\'annulation sans transaction', async () => {
      const response = await request(app)
        .post('/api/annuler')
        .expect(200);

      expect(response.body.remboursement).toBe(0);
      expect(response.body.solde).toBe(0);
      expect(response.body.panier).toHaveLength(0);
    });
  });

  describe('POST /api/paiement - Finaliser l\'achat', () => {
    test('doit finaliser un achat avec monnaie', async () => {
      // Préparer un achat
      await request(app)
        .post('/api/pieces')
        .send({ montant: 10 });
      
      await request(app)
        .post('/api/panier')
        .send({ idProduit: 1 }); // Soda - 3.5
      
      await request(app)
        .post('/api/panier')
        .send({ idProduit: 3 }); // Bonbon - 1.5

      // Finaliser
      const response = await request(app)
        .post('/api/paiement')
        .expect(200);

      expect(response.body.produits).toHaveLength(2);
      expect(response.body.produits[0].nom).toBe('Soda');
      expect(response.body.produits[1].nom).toBe('Bonbon');
      expect(response.body.monnaie).toEqual({
        5: 1 // 10 - 3.5 - 1.5 = 5 MAD
      });
    });

    test('doit finaliser un achat sans monnaie', async () => {
      // Montant exact
      await request(app)
        .post('/api/pieces')
        .send({ montant: 2 });
      
      await request(app)
        .post('/api/pieces')
        .send({ montant: 0.5 });
      
      await request(app)
        .post('/api/panier')
        .send({ idProduit: 4 }); // Eau - 2.5

      const response = await request(app)
        .post('/api/paiement')
        .expect(200);

      expect(response.body.produits).toHaveLength(1);
      expect(response.body.monnaie).toEqual({});
    });

    test('doit finaliser un achat vide', async () => {
      const response = await request(app)
        .post('/api/paiement')
        .expect(200);

      expect(response.body.produits).toHaveLength(0);
      expect(response.body.monnaie).toEqual({});
    });

    test('doit réinitialiser l\'état après finalisation', async () => {
      // Préparer et finaliser un achat
      await request(app)
        .post('/api/pieces')
        .send({ montant: 5 });
      
      await request(app)
        .post('/api/panier')
        .send({ idProduit: 3 }); // Bonbon - 1.5
      
      await request(app)
        .post('/api/paiement')
        .expect(200);

      // Vérifier la réinitialisation
      const etat = await request(app)
        .get('/api')
        .expect(200);

      expect(etat.body.solde).toBe(0);
      expect(etat.body.panier).toHaveLength(0);
      expect(etat.body.produits.every(p => !p.achetable)).toBe(true);
    });
  });

  describe('Gestion d\'erreurs', () => {
    test('doit retourner 404 pour un endpoint inexistant', async () => {
      const response = await request(app)
        .get('/api/inexistant')
        .expect(404);

      expect(response.body).toHaveProperty('erreur');
    });

    test('doit gérer les erreurs de méthode HTTP', async () => {
      await request(app)
        .put('/api')
        .expect(404);
    });

    test('doit gérer les données JSON malformées', async () => {
      const response = await request(app)
        .post('/api/pieces')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);
    });
  });

  describe('Scénarios d\'intégration complets', () => {
    test('doit gérer un parcours d\'achat complet', async () => {
      // 1. Vérifier l'état initial
      let etat = await request(app).get('/api').expect(200);
      expect(etat.body.solde).toBe(0);
      expect(etat.body.panier).toHaveLength(0);

      // 2. Insérer des pièces
      await request(app)
        .post('/api/pieces')
        .send({ montant: 5 })
        .expect(200);
      
      await request(app)
        .post('/api/pieces')
        .send({ montant: 2 })
        .expect(200);
      
      etat = await request(app)
        .post('/api/pieces')
        .send({ montant: 1 })
        .expect(200);
      
      expect(etat.body.solde).toBe(8);

      // 3. Ajouter des produits au panier
      await request(app)
        .post('/api/panier')
        .send({ idProduit: 1 }) // Soda - 3.5
        .expect(200);
      
      etat = await request(app)
        .post('/api/panier')
        .send({ idProduit: 2 }) // Chips - 2.0
        .expect(200);
      
      expect(etat.body.panier).toHaveLength(2);
      expect(etat.body.solde).toBe(2.5);

      // 4. Finaliser l'achat
      const resultat = await request(app)
        .post('/api/paiement')
        .expect(200);
      
      expect(resultat.body.produits).toHaveLength(2);
      expect(resultat.body.monnaie).toEqual({
        2: 1,
        0.5: 1
      });

      // 5. Vérifier la réinitialisation
      etat = await request(app).get('/api').expect(200);
      expect(etat.body.solde).toBe(0);
      expect(etat.body.panier).toHaveLength(0);
    });

    test('doit gérer un scénario d\'annulation', async () => {
      // Obtenir les stocks initiaux
      const etatInitial = await request(app).get('/api').expect(200);
      const stocksInitiaux = etatInitial.body.produits.map(p => ({
        id: p.id,
        quantite: p.quantite
      }));

      // Faire des achats
      await request(app)
        .post('/api/pieces')
        .send({ montant: 10 })
        .expect(200);
      
      await request(app)
        .post('/api/panier')
        .send({ idProduit: 1 }) // Soda
        .expect(200);
      
      await request(app)
        .post('/api/panier')
        .send({ idProduit: 2 }) // Chips
        .expect(200);

      // Annuler la transaction
      const resultat = await request(app)
        .post('/api/annuler')
        .expect(200);

      expect(resultat.body.remboursement).toBe(4.5); // 10 - 3.5 - 2
      expect(resultat.body.solde).toBe(0);
      expect(resultat.body.panier).toHaveLength(0);

      // Vérifier la restauration des stocks
      stocksInitiaux.forEach(stockInitial => {
        const produitActuel = resultat.body.produits.find(p => p.id === stockInitial.id);
        expect(produitActuel.quantite).toBe(stockInitial.quantite);
      });
    });

    test('doit gérer les tentatives d\'achat avec solde insuffisant', async () => {
      // Insérer peu d'argent
      await request(app)
        .post('/api/pieces')
        .send({ montant: 1 })
        .expect(200);

      // Tenter d'acheter un produit cher
      const response = await request(app)
        .post('/api/panier')
        .send({ idProduit: 1 }) 
        .expect(400);

      expect(response.body.erreur).toContain('Solde insuffisant');

      // Vérifier que l'état n'a pas changé
      const etat = await request(app).get('/api').expect(200);
      expect(etat.body.solde).toBe(1);
      expect(etat.body.panier).toHaveLength(0);
    });

    test('doit gérer l\'épuisement de stock', async () => {
      await request(app)
        .post('/api/pieces')
        .send({ montant: 10 })
        .expect(200);
      
      await request(app)
        .post('/api/pieces')
        .send({ montant: 10 })
        .expect(200);
      
      await request(app)
        .post('/api/pieces')
        .send({ montant: 10 })
        .expect(200);

      for (let i = 0; i < 20; i++) {
        await request(app)
          .post('/api/panier')
          .send({ idProduit: 3 }) 
          .expect(200);
      }

      // Tenter d'acheter un bonbon supplémentaire
      const response = await request(app)
        .post('/api/panier')
        .send({ idProduit: 3 })
        .expect(400);

      expect(response.body.erreur).toContain('Produit épuisé');
    });
  });

  describe('Tests de validation des données', () => {
    test('doit valider le type de données pour les pièces', async () => {
      const testCases = [
        { montant: null, description: 'null' },
        { montant: undefined, description: 'undefined' },
        { montant: '', description: 'chaîne vide' },
        { montant: 'abc', description: 'chaîne non numérique' },
        { montant: [], description: 'tableau' },
        { montant: {}, description: 'objet' }
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/pieces')
          .send({ montant: testCase.montant });

        expect(response.status).toBe(400);
        expect(response.body.erreur).toContain('Montant invalide');
      }
    });

    test('doit valider le type de données pour l\'ID produit', async () => {
      const testCases = [
        { idProduit: null, description: 'null' },
        { idProduit: undefined, description: 'undefined' },
        { idProduit: '', description: 'chaîne vide' },
        { idProduit: 'abc', description: 'chaîne non numérique' }
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/panier')
          .send({ idProduit: testCase.idProduit });

        expect(response.status).toBe(400);
        expect(response.body.erreur).toContain('id produit manquant');
      }
    });
  });
});