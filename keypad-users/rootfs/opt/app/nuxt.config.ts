

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    // baseURL: "/",
    // buildAssetsDir: "/_nuxt/"
  },
  runtimeConfig: {
    public: {
      pinLength: '4',
      printCodeLength: '6',
      rfidLength: '8'
    }
  },
  vite: {
    server: {
      watch: {
        usePolling: true
      }
    }
  },
  build: { transpile: ['trpc-nuxt', 'vuetify'] },
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
  ]
})
