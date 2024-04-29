<script setup>
// If you want to use it in setup, import from the nuxtApp.
const { $pwa } = useNuxtApp()

console.debug('pwa', $pwa)

if ($pwa.offlineReady) {
  console.log('App ready to work offline')
}
</script>

<template>
  <!-- You can use $pwa directly in templates! -->
  <div v-show="$pwa?.needRefresh">
    <span>
      New content available, click on reload button to update.
    </span>

    <button @click="$pwa.updateServiceWorker()">
      Reload
    </button>
  </div>
</template>
