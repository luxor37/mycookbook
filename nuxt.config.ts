// https://nuxt.com/docs/api/configuration/nuxt-config
import { isDevelopment } from "std-env";

const appTitle = "MyCookbook"

const appDescription = "MyCookbook"

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
  app: {
    head: {
      title: `${appTitle}`,
      charset: "utf-8",
      htmlAttrs: {
        lang: "fr",
      },
      viewport: "width=device-width, initial-scale=1",
      meta: [
        { name: "description", content: `${appDescription}` },
        { name: "theme-color", content: "#ffffff" },
        { name: "msapplication-TileColor", content: "#da532c" },
      ],
      link: [
        {
          rel: "icon",
          href: "/icons/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          rel: "icon",
          href: "/icons/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
        {
          rel: "apple-touch-icon",
          href: "/icons/apple-touch-icon.png",
          sizes: "180x180",
        },
        {
          rel: "mask-icon",
          href: "/icons/safari-pinned-tab.svg",
          color: "#5bbad5",
        },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },

  modules: [
    "@vite-pwa/nuxt",
    '@pinia/nuxt',
    '@nuxt/ui'
  ],

  colorMode: {
    preference: 'light'
  },

  ui: {
    global: true,
  },

  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  pwa: {
    mode: isDevelopment ? "development" : "production",
    scope: "/",
    filename: "sw.ts",
    strategies: "injectManifest",
    includeManifestIcons: false,
    manifest: {
      name: `${appTitle}`,
      short_name: `${appTitle}`,
      description: `${appDescription}`,
      theme_color: "#ffffff",
      icons: [
        {
          src: "/icons/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "/icons/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
      ],
      screenshots: [
        {
          src: "/screenshots/mobile-screenshot.png",
          sizes: "1125x1951",
          type: "image/png",
          label: "Home Screen on Mobile",
          platform: "mobile",
          form_factor: "narrow"
        },
        {
          src: "/screenshots/desktop-screenshot.png",
          sizes: "2880x1524",
          type: "image/png",
          label: "Home Screen on Desktop",
          platform: "web",
          form_factor: "wide"
        }
      ],
      start_url: "/",
      display: "fullscreen",
    },
    devOptions: {
      enabled: isDevelopment,
      type: "module",
    },
    client: {
      installPrompt: true,
    },
  },
})
