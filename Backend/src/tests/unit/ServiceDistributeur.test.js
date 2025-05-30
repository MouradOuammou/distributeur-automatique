/**
 * Tests unitaires pour la classe ServiceDistributeur
 * Teste la logique de service et la transformation des données
 */

const ServiceDistributeur = require('../../services/ServiceDistributeur');

describe('ServiceDistributeur - Tests unitaires', () => {

  let service;

  beforeEach(() => {
    service = new ServiceDistributeur();
  });

  describe('Obtenir état du distributeur', () => {
    test('doit retourner l\'état initial correct', () => {
      const etat = service.obtenirEtatDistributeur();
      
      expect(etat.solde).toBe(0);
      expect(etat.produits).toHaveLength(4);
      expect(etat.panier).toHaveLength(0);
      
      // Vérifier la structure des produits
      etat.produits.forEach(produit => {
        expect(produit).toHaveProperty('id');
        expect(produit).toHaveProperty('nom');
        expect(produit).toHaveProperty('prix');
        expect(produit).toHaveProperty('quantite');
        expect(produit).toHaveProperty('achetable');
        expect(produit.achetable).toBe(false); // Solde 0, donc rien n'est achetable
      });
    });

    test('doit marquer les produits comme achetables avec solde suffisant', () => {
      service.insererPiece(5);
      const etat = service.obtenirEtatDistributeur();
      
      const produitsBonMarche = etat.produits.filter(p => p.prix <= 5);
      produitsBonMarche.forEach(produit => {
        expect(produit.achetable).toBe(true);
      });
    });

    test('ne doit pas marquer comme achetable si stock épuisé', () => {
      service.insererPiece(10);
      service.distributeur.produits[0].quantite = 0; // Épuiser le premier produit
      
      const etat = service.obtenirEtatDistributeur();
      expect(etat.produits[0].achetable).toBe(false);
    });
  });

  describe('Insertion de pièce', () => {
    test('doit insérer une pièce et retourner le nouvel état', () => {
      const etat = service.insererPiece(5);
      
      expect(etat.solde).toBe(5);
      expect(etat.produits.some(p => p.achetable)).toBe(true);
    });

    test('doit propager les erreurs du modèle', () => {
      expect(() => {
        service.insererPiece(3); // Pièce non acceptée
      }).toThrow('Pièce non acceptée');
    });

    test('doit cumuler les pièces correctement', () => {
      service.insererPiece(2);
      const etat = service.insererPiece(1);
      
      expect(etat.solde).toBe(3);
    });
  });

  describe('Ajout au panier', () => {
    beforeEach(() => {
      service.insererPiece(10);
    });

    test('doit ajouter un produit au panier et retourner le nouvel état', () => {
      const etat = service.ajouterAuPanier(1); // Soda
      
      expect(etat.panier).toHaveLength(1);
      expect(etat.panier[0].nom).toBe('Soda');
      expect(etat.panier[0].prix).toBe(3.5);
      expect(etat.solde).toBe(6.5);
    });

    test('doit formater correctement les produits du panier', () => {
      service.ajouterAuPanier(1); // Soda
      const etat = service.ajouterAuPanier(2); // Chips
      
      expect(etat.panier).toHaveLength(2);
      etat.panier.forEach(produit => {
        expect(produit).toHaveProperty('id');
        expect(produit).toHaveProperty('nom');
        expect(produit).toHaveProperty('prix');
        expect(produit).not.toHaveProperty('quantite'); // Le panier ne doit pas avoir la quantité
      });
    });

    test('doit propager les erreurs du modèle', () => {
      expect(() => {
        service.ajouterAuPanier(99); // Produit inexistant
      }).toThrow('Produit non trouvé');
    });

    test('doit mettre à jour l\'état des produits achetables', () => {
      service.distributeur.solde = 2; // Solde exact pour chips
      const etat = service.ajouterAuPanier(2); // Chips - 2 MAD
      
      expect(etat.solde).toBe(0);
      etat.produits.forEach(produit => {
        expect(produit.achetable).toBe(false); // Plus de solde
      });
    });
  });

  describe('Annulation de transaction', () => {
    test('doit annuler et retourner le remboursement avec nouvel état', () => {
      service.insererPiece(10);
      service.ajouterAuPanier(1); // Soda - 3.5 MAD
      
      const resultat = service.annulerTransaction();
      
      expect(resultat.remboursement).toBe(6.5);
      expect(resultat.solde).toBe(0);
      expect(resultat.panier).toHaveLength(0);
      expect(resultat.produits.every(p => !p.achetable)).toBe(true);
    });

    test('doit restaurer le stock des produits annulés', () => {
      const stockInitial = service.distributeur.produits[0].quantite;
      service.insererPiece(10);
      service.ajouterAuPanier(1); // Soda
      
      const resultat = service.annulerTransaction();
      
      expect(resultat.produits[0].quantite).toBe(stockInitial);
    });

    test('doit gérer l\'annulation sans achat', () => {
      const resultat = service.annulerTransaction();
      
      expect(resultat.remboursement).toBe(0);
      expect(resultat.solde).toBe(0);
      expect(resultat.panier).toHaveLength(0);
    });
  });

  describe('Finalisation d\'achat', () => {
    test('doit finaliser un achat complet', () => {
      service.insererPiece(10);
      service.ajouterAuPanier(1); // Soda - 3.5 MAD
      service.ajouterAuPanier(3); // Bonbon - 1.5 MAD
      
      const resultat = service.finaliserAchat();
      
      expect(resultat.produits).toHaveLength(2);
      expect(resultat.produits[0].nom).toBe('Soda');
      expect(resultat.produits[1].nom).toBe('Bonbon');
      expect(resultat.monnaie).toEqual({
        5: 1 // 10 - 3.5 - 1.5 = 5 MAD
      });
    });

    test('doit réinitialiser le service après finalisation', () => {
      service.insererPiece(5);
      service.ajouterAuPanier(3); // Bonbon - 1.5 MAD
      
      service.finaliserAchat();
      
      const etat = service.obtenirEtatDistributeur();
      expect(etat.solde).toBe(0);
      expect(etat.panier).toHaveLength(0);
      expect(etat.produits.every(p => !p.achetable)).toBe(true);
    });

    test('doit gérer la finalisation sans achat', () => {
      const resultat = service.finaliserAchat();
      
      expect(resultat.produits).toHaveLength(0);
      expect(resultat.monnaie).toEqual({});
    });
  });

  describe('Intégration complète', () => {
    test('doit gérer un scénario d\'achat complet', () => {
      // Insérer des pièces
      service.insererPiece(5);
      service.insererPiece(2);
      service.insererPiece(1);
      
      // Vérifier l'état après insertion
      let etat = service.obtenirEtatDistributeur();
      expect(etat.solde).toBe(8);
      
      // Ajouter des produits
      service.ajouterAuPanier(1); 
      service.ajouterAuPanier(2); 
      
      etat = service.obtenirEtatDistributeur();
      expect(etat.solde).toBe(2.5);
      expect(etat.panier).toHaveLength(2);
      
      // Finaliser
      const resultat = service.finaliserAchat();
      expect(resultat.produits).toHaveLength(2);
      expect(resultat.monnaie).toEqual({
        2: 1,
        0.5: 1
      });
    });

    test('doit gérer un scénario d\'annulation après ajouts', () => {
      const stocksInitiaux = service.distributeur.produits.map(p => ({
        id: p.id,
        quantite: p.quantite
      }));
      
      // Acheter plusieurs produits
      service.insererPiece(10);
      service.ajouterAuPanier(1); 
      service.ajouterAuPanier(2);
      service.ajouterAuPanier(3); 
      
      // Annuler
      const resultat = service.annulerTransaction();
      
      // Vérifier la restauration des stocks
      stocksInitiaux.forEach(stockInitial => {
        const produitActuel = resultat.produits.find(p => p.id === stockInitial.id);
        expect(produitActuel.quantite).toBe(stockInitial.quantite);
      });
      
      expect(resultat.remboursement).toBe(3); // 10 - 3.5 - 2 - 1.5 = 3
    });
  });
});