/**
 * Fichier principal de configuration de l'application Express
 * Configure :
 * - Les middlewares
 * - Les routes
 * - La gestion d'erreurs
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');


// Routes API
app.use('/api', require('./routes/distributeurRoutes'));

// Servir les fichiers statiques (pour le frontend si intégré)
app.use(express.static(path.join(__dirname, 'public')));

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({ erreur: " Erreur , Endpoint non trouvé ! " });
});