/**
 * Classe représentant le distributeur automatique et sa logique métier
 */

class Distributeur {
  constructor() {
    // Initialisation des propriétés
    this.solde = 0; // Solde actuel de l'utilisateur en MAD
    this.produits = [ // Liste des produits disponibles
      { id: 1, nom: "Soda", prix: 3.5, quantite: 10 },
      { id: 2, nom: "Chips", prix: 2.0, quantite: 15 },
      { id: 3, nom: "Bonbon", prix: 1.5, quantite: 20 },
      { id: 4, nom: "Eau", prix: 2.5, quantite: 12 }
    ];
    this.panier = []; // Produits sélectionnés par l'utilisateur
    this.piecesAcceptees = [0.5, 1, 2, 5, 10]; // Pièces acceptées par la machine
  }
 
  
  /**
   * Insère une pièce dans le distributeur
   * @param {number} montant - Valeur de la pièce insérée
   * @throws {Error} Si la pièce n'est pas acceptée
   */
  insererPiece(montant) {
    if (!this.piecesAcceptees.includes(montant)) {
      throw new Error("Pièce non acceptée");
    }
    // Arrondi à 2 décimales pour éviter les erreurs de calcul
    this.solde = parseFloat((this.solde + montant).toFixed(2));
  }
}