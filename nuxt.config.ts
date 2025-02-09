// https://nuxt.com/docs/api/configuration/nuxt-config


export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon"],
  pages: true,
  compatibilityDate: "2025-01-27",
  css: ["~/assets/css/tailwind.css"],

  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    config: {
      theme: {
        fontFamily: {
          sans: ["Almarai", "serif"],
        },
      },
      content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue",
      ],
    },
  },

  app: {
    head: {
      title: "bazarSyria",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Your website description",
        },
      ],
      // ... other head elements ...
    },
  },

  runtimeConfig: {
    public: {
      apiBase: "https://pzsyria.com/",
    },
  },

  build: {
    transpile: ["@vue-leaflet/vue-leaflet"],
  },

  devtools: {
    timeline: {
      enabled: true
    }
  },

  // Remove any CSP headers that might block camera access
  nitro: {
    routeRules: {
      '/**': { 
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Headers': '*'
        }
      }
    }
  }
});