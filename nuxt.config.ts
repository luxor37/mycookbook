// https://nuxt.com/docs/api/configuration/nuxt-config
import { isDevelopment } from 'std-env'

const appTitle = 'MyCookbook'
const appDescription = 'Un simple site de recettes maisons.'
const logoURL = 'https://mycookb00k.netlify.app/icons/android-chrome-512x512.png'

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
  app: {
    rootTag: 'body',
    head: {
      title: `${appTitle}`,
      charset: 'utf-8',
      htmlAttrs: {
        lang: 'fr',
      },
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'description', content: `${appDescription}` },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'msapplication-TileColor', content: '#22c55e' },

        { name: 'description', content: `${appDescription}` },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },

        // Open Graph / Facebook meta tags
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: `${appTitle}` },
        { property: 'og:title', content: `${appTitle}` },
        { property: 'og:description', content: `${appDescription}` },
        { property: 'og:image', content: `${logoURL}` },
        { property: 'og:url', content: 'https://mycookb00k.netlify.app/' },

        // Twitter Card meta tags
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: `${appTitle}` },
        { name: 'twitter:description', content: `${appDescription}` },
        { name: 'twitter:image', content: `${logoURL}` },
      ],
      link: [
        {
          rel: 'icon',
          href: '/icons/favicon-32x32.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          rel: 'icon',
          href: '/icons/favicon-16x16.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          rel: 'apple-touch-icon',
          href: '/icons/apple-touch-icon.png',
          sizes: '180x180',
        },
        {
          rel: 'mask-icon',
          href: '/icons/safari-pinned-tab.svg',
          color: '#5bbad5',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  modules: ['@nuxt/ui', '@pinia/nuxt', '@vite-pwa/nuxt'],

  colorMode: {
    preference: 'light',
  },

  css: ['~/assets/css/main.css'],

  pwa: {
    mode: isDevelopment ? 'development' : 'production',
    scope: '/',
    filename: 'sw.ts',
    strategies: 'injectManifest',
    includeManifestIcons: false,
    manifest: {
      name: `${appTitle}`,
      short_name: `${appTitle}`,
      description: `${appDescription}`,
      theme_color: '#ffffff',
      icons: [
        {
          src: '/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
      ],
      screenshots: [
        {
          src: '/screenshots/mobile-screenshot.png',
          sizes: '1125x1951',
          type: 'image/png',
          label: 'Home Screen on Mobile',
          platform: 'mobile',
          form_factor: 'narrow',
        },
        {
          src: '/screenshots/desktop-screenshot.png',
          sizes: '2880x1524',
          type: 'image/png',
          label: 'Home Screen on Desktop',
          platform: 'web',
          form_factor: 'wide',
        },
      ],
      start_url: '/',
      display: 'fullscreen',
    },
    devOptions: {
      enabled: isDevelopment,
      type: 'module',
    },
    client: {
      installPrompt: true,
    },
  },

  pinia: {
    storesDirs: ['./stores/**'],
  },

  compatibilityDate: '2025-10-01',
})
