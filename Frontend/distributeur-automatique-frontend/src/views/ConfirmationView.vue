<template>
  <div class="confirmation">
    <h2>Merci pour votre achat !</h2>

    <div class="produits">
      <h3>Produits distribués:</h3>
      <ul>
        <li v-for="produit in transaction.produits" :key="produit.id">
          {{ produit.nom }} - {{ produit.prix }} MAD
        </li>
      </ul>
    </div>

    <div class="monnaie" v-if="Object.keys(transaction.monnaie).length > 0">
      <h3>Monnaie rendue:</h3>
      <div v-for="(quantite, piece) in transaction.monnaie" :key="piece">
        {{ quantite }} x {{ piece }} MAD
      </div>
    </div>

    <button @click="retourAccueil" class="retour">
      Retour à l'accueil
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const retourAccueil = () => router.push('/')
</script>

<style scoped>
.confirmation {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.produits, .monnaie {
  margin: 1.5rem 0;
}
.retour {
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
