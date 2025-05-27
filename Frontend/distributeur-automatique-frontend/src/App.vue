<template>
  <header>
    <h1>Distributeur Automatique</h1>
    <div class="solde">Solde: {{ solde }} MAD</div>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<script setup>
import { useDistributeurStore } from '@/stores/distributeur'
import { storeToRefs } from 'pinia'

const store = useDistributeurStore()
const { solde } = storeToRefs(store)
</script>

<style scoped>
header {
  background: #42b983;
  padding: 1rem;
  color: white;
  display: flex;
  justify-content: space-between;
}
.solde {
  font-weight: bold;
  background: white;
  color: #42b983;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}
</style>
