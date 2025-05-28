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
const app = express();


// Configuration CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware de parsing JSON
app.use(cors(corsOptions));


// Routes API
app.use('/api', require('./src/routes/distributeurRoutes'));

// Servir les fichiers statiques (pour le frontend si intégré)
app.use(express.static(path.join(__dirname, 'public')));

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({ erreur: " Erreur , Endpoint non trouvé ! " });
});



// Middleware de gestion d'erreurs 
app.use((err, req, res, next) => {
  console.error(`[Erreur] ${err.stack}`);
  
  const response = {
    erreur: "erreur est survenue",
    ...(process.env.NODE_ENV === 'development' && {
      details: err.message,
      stack: err.stack
    })
  };

  res.status(err.status || 500).json(response);
});

module.exports = app;