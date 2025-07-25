<template>
  <div class="p-4 border bg-white shadow">
    <h2 class="text-xl font-bold">Test de llamada</h2>
    <div v-if="call">
      <p><strong>Desde:</strong> {{ call.from }}</p>
      <p><strong>Para:</strong> {{ call.to }}</p>
    </div>
    <p v-else>No hay llamada.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import socket from '@/services/socket.js';

const call = ref(null);

onMounted(() => {
  socket.on('llamadaEntrante', (data) => {
    console.log('Evento recibido:', data);
    call.value = data;
  });
});
</script>
