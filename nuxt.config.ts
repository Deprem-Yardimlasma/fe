// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxt/content', '@nuxtjs/tailwindcss'],
    components: [
        {
            path: '~/components/global',
            extensions: ['.vue']
        }
    ],
    runtimeConfig: {
        public: {
            apiBase: ''
        }
    }
})
