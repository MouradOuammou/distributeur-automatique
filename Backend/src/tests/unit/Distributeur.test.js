/**
 * Tests unitaires pour la classe Distributeur
 * Teste toute la logique métier du distributeur automatique
 */

const Distributeur = require('../../modeles/Distributeur');

describe('Distributeur - Tests unitaires', () => {

  let distributeur;

  beforeEach(() => {
    distributeur = new Distributeur();
  });

  describe('Initialisation', () => {
    test('doit initialiser avec un solde de 0', () => {
      expect(distributeur.solde).toBe(0);
    });

    test('doit avoir 4 produits disponibles', () => {
      expect(distributeur.produits).toHaveLength(4);
    });

    test('doit avoir un panier vide', () => {
      expect(distributeur.panier).toHaveLength(0);
    });

    test(' accepter les pièces de 0.5, 1, 2, 5, 10 MAD', () => {
      expect(distributeur.piecesAcceptees).toEqual([0.5, 1, 2, 5, 10]);
    });
  });

  describe('Insertion de pièces', () => {
    test(' accepter une pièce valide', () => {
      distributeur.insererPiece(5);
      expect(distributeur.solde).toBe(5);
    });

    test(' cumuler plusieurs pièces', () => {
      distributeur.insererPiece(2);
      distributeur.insererPiece(1);
      distributeur.insererPiece(0.5);
      expect(distributeur.solde).toBe(3.5);
    });

    test(' rejeter une pièce non acceptée', () => {
      expect(() => {
        distributeur.insererPiece(3);
      }).toThrow('Pièce non acceptée');
    });

    test(' gérer les décimales correctement', () => {
      distributeur.insererPiece(0.5);
      distributeur.insererPiece(0.5);
      distributeur.insererPiece(0.5);
      expect(distributeur.solde).toBe(1.5);
    });
  });

  describe('Ajout au panier', () => {
    beforeEach(() => {
      distributeur.insererPiece(10); // Solde suffisant
    });

    test(' ajouter un produit existant au panier', () => {
      distributeur.ajouterAuPanier(1); // Soda - 3.5 MAD
      expect(distributeur.panier).toHaveLength(1);
      expect(distributeur.panier[0].nom).toBe('Soda');
      expect(distributeur.solde).toBe(6.5);
    });

    test(' décrémenter le stock du produit', () => {
      const stockInitial = distributeur.produits[0].quantite;
      distributeur.ajouterAuPanier(1);
      expect(distributeur.produits[0].quantite).toBe(stockInitial - 1);
    });

    test(' rejeter un produit inexistant', () => {
      expect(() => {
        distributeur.ajouterAuPanier(99);
      }).toThrow('Produit non trouvé');
    });

    test(' rejeter un produit épuisé', () => {
      // Épuiser le stock
      distributeur.produits[0].quantite = 0;
      expect(() => {
        distributeur.ajouterAuPanier(1);
      }).toThrow('Produit épuisé');
    });

    test(' rejeter si solde insuffisant', () => {
      distributeur.solde = 1; // Solde insuffisant pour un Soda (3.5 MAD)
      expect(() => {
        distributeur.ajouterAuPanier(1);
      }).toThrow('Solde insuffisant');
    });

    test(' permettre plusieurs produits dans le panier', () => {
      distributeur.ajouterAuPanier(1); // Soda - 3.5 MAD
      distributeur.ajouterAuPanier(2); // Chips - 2.0 MAD
      expect(distributeur.panier).toHaveLength(2);
      expect(distributeur.solde).toBe(4.5);
    });
  });

  describe('Vider le panier', () => {
    test('doit vider le panier', () => {
      distributeur.insererPiece(10);
      distributeur.ajouterAuPanier(1);
      distributeur.ajouterAuPanier(2);
      
      distributeur.viderPanier();
      expect(distributeur.panier).toHaveLength(0);
    });
  });

  describe('Annulation de transaction', () => {
    test('doit rembourser le solde et vider le panier', () => {
      distributeur.insererPiece(10);
      distributeur.ajouterAuPanier(1); // Soda - 3.5 MAD
      
      const remboursement = distributeur.annulerTransaction();
      
      expect(remboursement).toBe(6.5);
      expect(distributeur.solde).toBe(0);
      expect(distributeur.panier).toHaveLength(0);
    });

    test('doit réintégrer les produits au stock', () => {
      distributeur.insererPiece(10);
      const stockInitial = distributeur.produits[0].quantite;
      
      distributeur.ajouterAuPanier(1); // Soda
      distributeur.ajouterAuPanier(1); // Autre Soda
      
      distributeur.annulerTransaction();
      
      expect(distributeur.produits[0].quantite).toBe(stockInitial);
    });

    test('doit retourner 0 si aucun solde', () => {
      const remboursement = distributeur.annulerTransaction();
      expect(remboursement).toBe(0);
    });
  });

  describe('Calcul de monnaie optimale', () => {
    test('doit calculer la monnaie pour 7.5 MAD', () => {
      const monnaie = distributeur.calculerMonnaieOptimale(7.5);
      expect(monnaie).toEqual({
        5: 1,
        2: 1,
        0.5: 1
      });
    });

    test('doit calculer la monnaie pour 13 MAD', () => {
      const monnaie = distributeur.calculerMonnaieOptimale(13);
      expect(monnaie).toEqual({
        10: 1,
        2: 1,
        1: 1
      });
    });

    test('doit calculer la monnaie pour 0.5 MAD', () => {
      const monnaie = distributeur.calculerMonnaieOptimale(0.5);
      expect(monnaie).toEqual({
        0.5: 1
      });
    });

    test('doit retourner un objet vide pour 0 MAD', () => {
      const monnaie = distributeur.calculerMonnaieOptimale(0);
      expect(monnaie).toEqual({});
    });
  });

  describe('Finalisation d\'achat', () => {
    test('doit finaliser un achat avec monnaie', () => {
      distributeur.insererPiece(10);
      distributeur.ajouterAuPanier(1); // Soda - 3.5 MAD
      distributeur.ajouterAuPanier(3); // Bonbon - 1.5 MAD
      
      const resultat = distributeur.finaliserAchat();
      
      expect(resultat.produits).toHaveLength(2);
      expect(resultat.produits[0].nom).toBe('Soda');
      expect(resultat.produits[1].nom).toBe('Bonbon');
      expect(resultat.monnaie).toEqual({
      });
      
      // Vérifier la réinitialisation
      expect(distributeur.solde).toBe(0);
      expect(distributeur.panier).toHaveLength(0);
    });

    test('doit finaliser un achat sans monnaie', () => {
      distributeur.insererPiece(2);
      distributeur.insererPiece(2);
      distributeur.ajouterAuPanier(4); 
      distributeur.ajouterAuPanier(3); 
      const resultat = distributeur.finaliserAchat();
      
      expect(resultat.produits).toHaveLength(2);
      expect(resultat.monnaie).toEqual({});
    });

    test('doit finaliser un achat vide', () => {
      const resultat = distributeur.finaliserAchat();
      
      expect(resultat.produits).toHaveLength(0);
      expect(resultat.monnaie).toEqual({});
    });
  });

  describe('Cas limites', () => {
    test('doit gérer les calculs avec précision décimale', () => {
      distributeur.insererPiece(0.5);
      distributeur.insererPiece(0.5);
      distributeur.insererPiece(0.5);
      expect(distributeur.solde).toBe(1.5);
    });

    test('doit permettre d\'acheter tout le stock d\'un produit', () => {
      distributeur.insererPiece(10);
      distributeur.insererPiece(10);
      distributeur.insererPiece(10);
      
      const stockInitial = distributeur.produits.find(p => p.id === 3).quantite; // Bonbon
      
      // Acheter tout le stock de bonbons
      for (let i = 0; i < stockInitial; i++) {
        distributeur.ajouterAuPanier(3);
      }
      
      expect(distributeur.produits.find(p => p.id === 3).quantite).toBe(0);
      expect(() => {
        distributeur.ajouterAuPanier(3);
      }).toThrow('Produit épuisé ');
    });
  });
});