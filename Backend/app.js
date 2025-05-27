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