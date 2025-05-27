import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

import type { Produit } from '@/models/Produit'
import type { PanierItem } from '@/models/PanierItem'
import type { Transaction } from '@/models/Transaction'

// Définition du store Pinia pour gérer l'état du distributeur automatique

export const useDistributeurStore = defineStore('distributeur', () => {
  // Montant inséré par l'utilisateur
  const solde = ref<number>(0)

  // Liste des produits disponibles dans le distributeur
  const produits = ref<Produit[]>([])

  // Liste des produits ajoutés au panier par l'utilisateur
  const panier = ref<PanierItem[]>([])

  // Résultat de la dernière transaction (produits achetés et monnaie rendue)
  const transaction = ref<Transaction | null>(null)

  // --- GETTERS COMPUTÉS ---

  // Liste des produits que l'utilisateur peut acheter selon son solde
  const produitsAchetables = computed(() =>
    produits.value.filter(p => p.achetable)
  )

  // Calcul du total du panier
  const totalPanier = computed(() =>
    panier.value.reduce((sum, item) => sum + item.prix * (item.quantite ?? 1), 0)
  )

  // --- ACTIONS ASYNC ---

  /**
   * Charge les produits et le solde actuels depuis le backend
   */
  async function chargerProduits() {
    try {
      const response = await api.get<{ produits: Produit[] }>('/api')
      produits.value = response.data.produits
    } catch (error) {
      console.error("Erreur chargement produits:", error)
    }
  }

  /**
   * Insère une pièce dans le distributeur
   * @param {number} montant - Le montant de la pièce insérée
   */
  async function insererPiece(montant: number) {
    try {
      const response = await api.post<{ solde: number, produits: Produit[] }>('/api/pieces', { montant })
      solde.value = response.data.solde
      produits.value = response.data.produits
    } catch (error: any) {
      alert(error.response?.data?.erreur || "Erreur lors de l'insertion")
    }
  }

  /**
   * Ajoute un produit au panier
   * @param {number} idProduit - ID du produit sélectionné
   */
  async function ajouterAuPanier(idProduit: number) {
    try {
      const response = await api.post<{ panier: PanierItem[], solde: number, produits: Produit[] }>('/api/panier', { idProduit })
      panier.value = response.data.panier
      solde.value = response.data.solde
      produits.value = response.data.produits
    } catch (error: any) {
      alert(error.response?.data?.erreur || "Erreur lors de l'ajout")
    }
  }

  /**
   * Finalise l'achat : récupère la monnaie rendue et les produits achetés
   */
  async function finaliserAchat() {
    try {
      const response = await api.post<Transaction>('/api/paiement')
      transaction.value = response.data
      panier.value = [] // Réinitialise le panier après achat
      return transaction.value
    } catch (error: any) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        // @ts-ignore
        alert(error.response?.data?.erreur || "Erreur lors du paiement")
      } else {
        alert("Erreur lors du paiement")
      }
    }
  }

  // Retourne les états, getters et actions accessibles depuis les composants Vue
  return {
    solde,
    produits,
    panier,
    transaction,
    produitsAchetables,
    totalPanier,
    chargerProduits,
    insererPiece,
    ajouterAuPanier,
    finaliserAchat
  }
})
