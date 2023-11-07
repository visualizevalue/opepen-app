import VueFeather from 'vue-feather'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FeatherIcon', VueFeather)
})
