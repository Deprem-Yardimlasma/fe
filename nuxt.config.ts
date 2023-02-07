// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxt/content', '@nuxtjs/tailwindcss', 'nuxt-icon'],
    components: [
        {
            path: '~/components/global',
            extensions: ['.vue']
        }
    ],
    css: [
      '@vueform/multiselect/themes/default.css'
    ],
    runtimeConfig: {
        public: {
            apiBase: 'https://api.toplumsalyardimlasma.com'
        }
    },
})
