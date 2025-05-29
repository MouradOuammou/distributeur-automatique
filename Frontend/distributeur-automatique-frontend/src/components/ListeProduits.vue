<template>
  <div class="liste-produits" data-cy="liste-produits">
    <h2>Produits disponibles</h2>
    <div class="grid">
      <div
        v-for="produit in produits"
        :key="produit.id"
        class="produit"
        :class="{ 'non-disponible': !produit.achetable }"
      >
        <h3>{{ produit.nom }}</h3>
        <div class="prix">{{ produit.prix }} MAD</div>
        <div v-if="!produit.achetable" class="indisponible">
          {{ produit.quantite > 0 ? 'Solde insuffisant' : 'Épuisé' }}
        </div>

        <!-- Bouton avec data-cy correct -->
        <button
          v-if="produit.achetable"
          @click="emit('ajouter-panier', produit.id)"
          class="btn-ajouter"
          data-cy="btn-ajouter-panier"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  produits: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['ajouter-panier'])
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}
.produit {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
.produit:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.prix {
  font-weight: bold;
  color: #42b983;
  margin-top: 0.5rem;
}
.non-disponible {
  opacity: 0.6;
  cursor: not-allowed;
}
.indisponible {
  color: #ff4757;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}
</style>
