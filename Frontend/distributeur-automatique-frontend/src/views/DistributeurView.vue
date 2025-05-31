<template>
  <div class="distributeur" data-cy="distributeur-view">
    <!-- CORRECTION : Passer le montant inséré au composant -->
    <PieceInsertion
      @piece-inseree="insererPiece"
      :montant-insere="solde"
      data-cy="piece-insertion"
    />

    <div class="content">
      <ListeProduits
        :produits="produits"
        @ajouter-panier="ajouterAuPanier"
        data-cy="liste-produits"
      />

      <Panier
        :items="panier"
        :total="totalPanier"
        @finaliser="finaliserAchat"
        data-cy="panier"
      />
    </div>

    <!-- Messages d'erreur ou de statut -->
    <div v-if="messageErreur" class="message-erreur" data-cy="message-erreur">
      {{ messageErreur }}
    </div>
  </div>
</template>

<script setup>
import { useDistributeurStore } from '@/stores/distributeur'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import PieceInsertion from '@/components/PieceInsertion.vue'
import ListeProduits from '@/components/ListeProduits.vue'
import Panier from '@/components/Panier.vue'

const router = useRouter()
const store = useDistributeurStore()
const { produits, panier, totalPanier ,solde } = storeToRefs(store)

const messageErreur = ref('')

const insererPiece = (montant) => store.insererPiece(montant)
const ajouterAuPanier = (id) => store.ajouterAuPanier(id)

async function finaliserAchat() {
  try {
    messageErreur.value = '' // Reset message d'erreur

    const transaction = await store.finaliserAchat()

    if (transaction) {
      // Navigation simple - la transaction est sauvée dans le store
      router.push('/confirmation')
    } else {
      messageErreur.value = 'Impossible de finaliser l\'achat. Vérifiez votre solde.'
    }
  } catch (error) {
    console.error('Erreur lors de la finalisation:', error)
    messageErreur.value = 'Une erreur est survenue lors de la transaction.'
  }
}

onMounted(() => {
  store.chargerProduits()
})
</script>

<style scoped>
.distributeur {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.message-erreur {
  margin-top: 1rem;
  padding: 1rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  color: #c33;
  text-align: center;
}

@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
