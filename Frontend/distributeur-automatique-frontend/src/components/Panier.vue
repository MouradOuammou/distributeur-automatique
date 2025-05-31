<template>
  <div class="panier" data-cy="panier">
    <h2>Votre Panier</h2>

    <div v-if="items.length === 0" class="vide" data-cy="panier-items" >
      Panier vide
    </div>

    <div v-else data-cy="panier-items">
      <div v-for="item in items" :key="item.id" class="item">
        <span class="nom">{{ item.nom }}</span>
        <span class="prix">{{ item.prix }} MAD</span>
      </div>

      <div class="total">
        Total: <strong>{{ total }} MAD</strong>
      </div>

      <button
        @click="emit('finaliser')"
        class="btn-payer"
        data-cy="btn-finaliser"
      >
        Payer maintenant
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['finaliser'])
</script>

<style scoped>
.panier {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  height: fit-content;
}
.item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}
.total {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #ddd;
  text-align: right;
}
.payer {
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.payer:hover {
  background: #3aa876;
}
.vide {
  color: #888;
  text-align: center;
  padding: 1rem;
}
</style>
