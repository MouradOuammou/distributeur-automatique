import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

import type { Produit } from '@/models/Produit'
import type { PanierItem } from '@/models/PanierItem'
import type { Transaction } from '@/models/Transaction'

// Définition du store Pinia pour gérer l'état du distributeur automatique
export const useDistributeurStore = defineStore('distributeur', () => {
  const solde = ref<number>(0)
  const produits = ref<Produit[]>([])
  const panier = ref<PanierItem[]>([])
  const transaction = ref<Transaction | null>(null)

  const produitsAchetables = computed(() =>
    produits.value.filter(p => p.achetable)
  )

  const totalPanier = computed(() =>
    panier.value.reduce((sum, item) => sum + item.prix * (item.quantite ?? 1), 0)
  )

  async function chargerProduits() {
    try {
      const response = await api.get<{ produits: Produit[] }>('/api')
      produits.value = response.data.produits
    } catch (error) {
      console.error("Erreur chargement produits:", error)
    }
  }

  async function insererPiece(montant: number) {
    try {
      const response = await api.post<{ solde: number, produits: Produit[] }>('/api/pieces', { montant })
      solde.value = response.data.solde
      produits.value = response.data.produits
    } catch (error: any) {
      alert(error.response?.data?.erreur || "Erreur lors de l'insertion")
    }
  }

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

  async function finaliserAchat() {
    try {
      const response = await api.post<Transaction>('/api/paiement')
      transaction.value = response.data
      panier.value = [] // Réinitialise le panier après achat
      solde.value = 0   // Réinitialise le solde après achat
      return transaction.value
    } catch (error: any) {
      console.error("Erreur finaliserAchat:", error)
      if (typeof error === 'object' && error !== null && 'response' in error) {
        // @ts-ignore
        alert(error.response?.data?.erreur || "Erreur du paiement")
      } else {
        alert("Erreur du paiement")
      }
      return null
    }
  }
   function reinitialiser() {
    solde.value = 0
    panier.value = []
    transaction.value = null
    produits.value = []
  }


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
    finaliserAchat,
    reinitialiser
  }
})
