/**
 * Contrôleur pour gérer les requêtes HTTP
 * Responsable de :
 * - Valider les entrées
 * - Appeler les services
 * - Gérer les réponses/erreurs
 */
class DistributeurControleur {
  /**
   * @param {ServiceDistributeur} service - Instance du service
   */
  constructor(service) {
    this.service = service;
  }

  /**
   * GET /api - Récupère l'état courant
   */
  async obtenirEtat(req, res) {
    try {
      const etat = this.service.obtenirEtatDistributeur();
      res.json(etat);
    } catch (erreur) {
      console.error("[Contrôleur] obtenirEtat:", erreur);
      res.status(500).json({ 
        erreur: "Erreur  de la récupération de l'état",
        details: process.env.NODE_ENV === 'development' ? erreur.message : undefined
      });
    }
  }
    /**
   * POST /api/pieces - Insère une pièce
   */
  async insererPiece(req, res) {
    try {
      const { montant } = req.body;
      
      if (montant === undefined || isNaN(montant)) {
        return res.status(400).json({ erreur: "Montant invalide ! " });
      }

      const etat = this.service.insererPiece(parseFloat(montant));
      res.json(etat);
    } catch (erreur) {
      console.error("[Contrôleur] insererPiece:", erreur);
      res.status(400).json({ 
        erreur: erreur.message || "Erreur  de l'insertion"
      });
    }
  }
  /**
   * POST /api/panier - Ajoute un produit au panier
   */
  async ajouterAuPanier(req, res) {
    try {
      const { idProduit } = req.body;
      
      if (!idProduit) {
        return res.status(400).json({ erreur: "id produit manquant !" });
      }

      const etat = this.service.ajouterAuPanier(parseInt(idProduit));
      res.json(etat);
    } catch (erreur) {
      console.error("[Contrôleur] ajouterAuPanier:", erreur);
      res.status(400).json({ 
        erreur: erreur.message || "Erreur lors de l'ajout au panier ! "
      });
    }
  }
    /**
   * POST /api/annuler - Annule la transaction
   */
  async annulerTransaction(req, res) {
    try {
      const resultat = this.service.annulerTransaction();
      res.json(resultat);
    } catch (erreur) {
      console.error("[Contrôleur] annuler Transaction:", erreur);
      res.status(500).json({ 
        erreur: "Erreur lors de l'annulation ! ",
        details: process.env.NODE_ENV === 'development' ? erreur.message : undefined
      });
    }
  }
}