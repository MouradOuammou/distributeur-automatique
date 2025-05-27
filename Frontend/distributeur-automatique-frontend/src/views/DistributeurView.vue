<template>
  <div class="distributeur">
    <PieceInsertion @piece-inseree="insererPiece" />

    <div class="content">
      <ListeProduits
        :produits="produits"
        @ajouter-panier="ajouterAuPanier"
      />

      <Panier
        :items="panier"
        :total="totalPanier"
        @finaliser="finaliserAchat"
      />
    </div>
  </div>
</template>

<script setup>
import { useDistributeurStore } from '@/stores/distributeur'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PieceInsertion from '@/components/PieceInsertion.vue'
import ListeProduits from '@/components/ListeProduits.vue'
import Panier from '@/components/Panier.vue'

const router = useRouter()
const store = useDistributeurStore()
const { produits, panier, totalPanier } = storeToRefs(store)

const insererPiece = (montant) => store.insererPiece(montant)
const ajouterAuPanier = (id) => store.ajouterAuPanier(id)

async function finaliserAchat() {
  const transaction = await store.finaliserAchat()
  if (transaction) {
    router.push({ name: 'confirmation', state: { transaction } })
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
</style>
