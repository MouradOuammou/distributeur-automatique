import axios from 'axios'
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

// Création d'une instance axios préconfigurée
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // URL de base pour toutes les requêtes (backend local)
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur de réponse pour gérer les erreurs
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Si une réponse d'erreur est disponible (erreur côté backend)
    if (error.response) {
      console.error('Erreur API !:', error.response.data) // Affiche le message d'erreur de l'API
    } else {
      console.error('Erreur réseau !:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api
