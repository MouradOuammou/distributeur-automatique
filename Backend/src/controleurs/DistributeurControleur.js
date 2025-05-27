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
        erreur: "Erreur lors de la récupération de l'état",
        details: process.env.NODE_ENV === 'development' ? erreur.message : undefined
      });
    }
  }
  
}