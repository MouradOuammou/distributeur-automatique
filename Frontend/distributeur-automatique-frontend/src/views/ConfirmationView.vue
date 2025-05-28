<template>
  <div class="confirmation">
    <!-- Affichage conditionnel si pas de transaction -->
    <div v-if="!store.transaction" class="no-transaction">
      <h2>Aucune transaction trouvée</h2>
      <p>Vous allez être redirigé vers l'accueil...</p>
    </div>

    <!-- Affichage normal si transaction existe -->
    <div v-else>
      <h2>Merci pour votre achat !</h2>

      <div class="produits">
        <h3>Produits distribués:</h3>
        <ul>
          <li v-for="produit in store.transaction.produits" :key="produit.id">
            {{ produit.nom }} - {{ produit.prix }} MAD
          </li>
        </ul>
      </div>

      <div class="monnaie" v-if="store.transaction.monnaie && Object.keys(store.transaction.monnaie).length > 0">
        <h3>Monnaie rendue:</h3>
        <div v-for="(quantite, piece) in store.transaction.monnaie" :key="piece">
          {{ quantite }} x {{ piece }} MAD
        </div>
      </div>

      <div class="total" v-if="store.transaction.total">
        <h3>Total payé: {{ store.transaction.total }} MAD</h3>
      </div>
    </div>

    <button @click="retourAccueil" class="retour">
      Retour à l'accueil
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useDistributeurStore } from '@/stores/distributeur'
import { onMounted } from 'vue'

const router = useRouter()
const store = useDistributeurStore()

onMounted(() => {
  if (!store.transaction) {
    console.warn('Aucune transaction trouvée, redirection vers Accueil...')
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }
})

const retourAccueil = () => {
`  console.log('Retour à l\'accueil')`
  router.push('/')
}
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

.no-transaction {
  text-align: center;
  color: #e74c3c;
}

.produits, .monnaie, .total {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.produits ul {
  list-style: none;
  padding: 0;
}

.produits li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #dee2e6;
}

.produits li:last-child {
  border-bottom: none;
}

.retour {
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.retour:hover {
  background: #369870;
}
</style>
