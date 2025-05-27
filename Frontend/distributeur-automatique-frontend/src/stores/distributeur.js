
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'


// Définition du store Pinia pour gérer l'état du distributeur automatique


export const useDistributeurStore = defineStore('distributeur', () => {
    // Montant inséré par l'utilisateur
  const solde = ref(0)

  // Liste des produits disponibles dans le distributeur
  const produits = ref([])

  // Liste des produits ajoutés au panier par l'utilisateur
  const panier = ref([])

  // Résultat de la dernière transaction (produits achetés et monnaie rendue)
  const transaction = ref(null)

}
