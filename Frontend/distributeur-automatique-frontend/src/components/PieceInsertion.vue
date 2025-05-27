<template>
  <div class="piece-insertion">
    <h2>Insérer une pièce</h2>
    <div class="pieces">
      <button
        v-for="piece in pieces"
        :key="piece"
        @click="emit('piece-inseree', piece)"
      >
        {{ piece }} MAD
      </button>
    </div>
  </div>
</template>

<script setup>
const pieces = [0.5, 1, 2, 5, 10]
const emit = defineEmits(['piece-inseree'])
</script>

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
