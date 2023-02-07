<template>
    <div class="navbar bg-base-100 justify-between">
        <nuxt-link class="btn btn-ghost normal-case text-xl" to="/">toplumsalyardimlasma.org</nuxt-link>
        <div>
            <nuxt-link class="btn btn-ghost normal-case text-xl" to="/">Yardım Bildirimi</nuxt-link>
            <nuxt-link class="btn btn-ghost normal-case text-xl" to="/list">Kayıtlı Talepler</nuxt-link>
            <ContentList v-slot="{ list }">
                <div class="flex gap-4">
                    <nuxt-link v-for="article in list" class="btn btn-ghost normal-case text-xl" :to="article._path">{{ article.title }}</nuxt-link>
                </div>
            </ContentList>
        </div>
    </div>
</template>
