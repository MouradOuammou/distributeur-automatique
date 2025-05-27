const express = require('express');
const router = express.Router();
const ServiceDistributeur = require('../services/ServiceDistributeur');
const DistributeurControleur = require('../controleurs/DistributeurControleur');

// Initialisation des dépendances
const service = new ServiceDistributeur();
const controleur = new DistributeurControleur(service);

// Middleware de validation pour les routes POST
const validateBody = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ erreur: "Corps de requête vide" });
  }
  next();
};

/**
 * GET /api - Récupère l'état courant
 */
router.get('/', controleur.obtenirEtat.bind(controleur));