<script lang="ts" setup>
const init = await useNuxtApp().$client.user.getUser.useQuery({ id: useRoute().params.id as string })
</script>

<template>
  <v-app id="inspire">
    <v-main>
      <v-container>
        <user-form 
          :userid="(useRoute().params.id as string)"
          :name="init.data.value?.name" 
          :code="init.data.value?.code?.code" 
          :tag="init.data.value?.tag?.code" 
          :prints="init.data.value?.prints"
        />
      </v-container>
    </v-main>
  </v-app>
</template>