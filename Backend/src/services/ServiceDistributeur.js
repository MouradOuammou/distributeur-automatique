const Distributeur = require('../modeles/Distributeur');

/**
 * Service intermédiaire entre le contrôleur et le modèle
 * Gère la logique applicative et la transformation des données
 */
class ServiceDistributeur {
  constructor() {
    /**
     * @type {Distributeur} Instance du modèle Distributeur
     */
    this.distributeur = new Distributeur();
  }
  /**
   * Récupère l'état complet du distributeur
   * @returns {Object} Format standardisé pour l'API
   */
  obtenirEtatDistributeur() {
    return {
      solde: this.distributeur.solde,
      produits: this.distributeur.produits.map(produit => ({
        id: produit.id,
        nom: produit.nom,
        prix: produit.prix,
        quantite: produit.quantite,
        achetable: this.distributeur.solde >= produit.prix && produit.quantite > 0
      })),
      panier: this.distributeur.panier.map(produit => ({
        id: produit.id,
        nom: produit.nom,
        prix: produit.prix
      }))
    };
  }
}