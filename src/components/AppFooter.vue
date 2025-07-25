<template>
  <v-footer
    app
    color="background"
    class="d-flex flex-column align-center justify-center py-4"
  >
    <div class="text-caption text-medium-emphasis">
      © {{ new Date().getFullYear() }} — Steven JR
    </div>

    <div v-if="showSocial" class="mt-2 d-flex gap-4">
      <v-btn icon href="https://facebook.com" target="_blank">
        <v-icon>mdi-facebook</v-icon>
      </v-btn>
      <v-btn icon href="https://twitter.com" target="_blank">
        <v-icon>mdi-twitter</v-icon>
      </v-btn>
      <v-btn icon href="https://github.com" target="_blank">
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </div>
  </v-footer>
</template>

<script setup>
const showSocial = false
</script>
