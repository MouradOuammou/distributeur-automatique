<template>
  <div class="piece-insertion" data-cy="piece-insertion">
    <h2>Insérer une pièce</h2>

    <!-- Affichage du montant inséré -->
    <div v-if="montantInsere > 0" class="montant-affiche" data-cy="montant-inseré">
      Montant inséré: {{ montantInsere }} MAD
    </div>

    <div class="pieces">
      <button
        v-for="piece in pieces"
        :key="piece"
        @click="emit('piece-inseree', piece)"
        class="btn-piece"
        data-cy="inserer-piece-button"
      >
        {{ piece }} MAD
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  montantInsere: {
    type: Number,
    default: 0
  }
})

const pieces = [0.5, 1, 2, 5, 10]
const emit = defineEmits(['piece-inseree'])
</script>

<style scoped>
.piece-insertion {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.montant-affiche {
  background: #e8f5e8;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  font-weight: bold;
  color: #2d5a2d;
}

.pieces {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-piece {
  padding: 10px 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-piece:hover {
  background: #0056b3;
}
</style>

<style scoped>
.pieces {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
button {
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #3aa876;
}
</style>
