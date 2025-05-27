import axios from 'axios'

// Création d'une instance axios préconfigurée
const api = axios.create({
  baseURL: 'http://localhost:3000', // URL de base pour toutes les requêtes (backend local)
  headers: {
    'Content-Type': 'application/json' // Type de contenu par défaut pour les requêtes POST/PUT
  }
})
