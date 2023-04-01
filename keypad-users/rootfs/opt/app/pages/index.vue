<script lang="ts" setup>
// import { TRPCClientError, TRPCClientErrorLike } from '@trpc/client'
// import type { inferRouterOutputs } from '@trpc/server'
// import type { AppRouter } from '@/server/trpc/routers'
// import { TypeOf } from 'zod';
// import { AsyncDataExecuteOptions } from 'nuxt/dist/app/composables/asyncData';
// type RouterOutput = inferRouterOutputs<AppRouter>
// type ErrorOutput = TRPCClientErrorLike<AppRouter>
// type GetTodosOutput = RouterOutput['todo']['getTodos']

// const client = await useNuxtApp().$client

// const client = useClient()
// const { data:hello, refresh } = await useNuxtApp().$client.hello.useQuery({ text: "Mark", email: "test@test.com" }, {immediate: false})

// const { data:hello, refresh } = await useGetGreeting("Test3")
// const { data: todos, pending, error, refresh } = await useAsyncData(() => $client.todo.getTodos.useQuery())
// const { data: todos, pending, error, refresh } = $client.todo.getTodos.useQuery()
// const { data: todos, pending, error, refresh } = useGetTodos()

// const test = ref<GetTodosOutput|null>(null)

// const hello = ref<inferRouterOutputs<AppRouter>['hello'] | null>(null)

// let pending = ref(false)
// let todos = ref<GetTodosOutput|null>(null)
// let error = ref<ErrorOutput>()

// onMounted(async () => {
//   // const { $client } = useNuxtApp()
// const { data: todos, pending, error } = await $client.todo.getTodos.useQuery()
// test.value = todos.value
// })


// let hello: globalThis.Ref<inferRouterOutputs<AppRouter>['hello'] | null> | undefined = undefined
// let pending: globalThis.Ref<boolean> | undefined = undefined
// let error: globalThis.Ref<ErrorOutput | null> | undefined = undefined
// let refresh: ((opts?: AsyncDataExecuteOptions | undefined) => Promise<void>) | undefined = undefined

// const title = computed(() => {
//   return hello?.value?.greeting || 'App'
// })

// onMounted(async () => {
//   const { $client } = useNuxtApp()
//   ;({ data: hello, pending, error, refresh } = await $client.hello.useQuery({ text: 'client' }))

//   // const res = await $client.hello.useQuery({ text: 'client' })
//   // hello.value = todos.value
// })

const { data: users, pending: usersPending, error: usersError, refresh: usersRefresh } = await useNuxtApp().$client.user.getAllUsers.useQuery(undefined, {immediate: false})

function tryRefresh() {
  usersRefresh()
}

onMounted(async () => {
  tryRefresh()
  // const res = await refresh()
})

async function deleteUser(name: string) {
  try {
    const res = await useNuxtApp().$client.user.deleteUser.mutate(name)
    tryRefresh()
    console.log("🚀 ~ file: index.vue:67 ~ deleteUser ~ res:", res)
  } catch (error) {
    
  }
}

function editUser(id: string) {
  navigateTo(id)
}

async function changeActive(value: boolean, idx: number) {
  // console.log("🚀 ~ file: index.vue:79 ~ changeActive ~ value:", value, users.value?.[idx].id)
  
  if(users.value?.[idx]) {
    users.value[idx].active = value
    try {
      const res = await useNuxtApp().$client.user.changeActiveState.mutate({ id: users.value[idx].id, value})
      console.log("🚀 ~ file: index.vue:85 ~ changeActive ~ res:", res)
    } catch (error) {
      tryRefresh()
    }
  }
}

</script>

<template>
  <v-app id="inspire">
    <v-main>
      <v-container>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">
                Active
              </th>
              <th class="text-left">
                Name
              </th>
              <th class="text-left">
                Pin
              </th>
              <th class="text-left">
                Tag
              </th>
              <th class="text-left">
                Prints
              </th>
              <th class="text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item, index in users"
              :key="item.id"
            >
              <td>
                <v-checkbox-btn :model-value="item.active" @update:model-value="changeActive($event, index)" />
              </td>
              <td>{{ item.name }}</td>
              <td>
                <v-chip v-if="item.code" class="ma-1">
                  {{ item.code.code }}
                </v-chip>
              </td>
              <td>
                <v-chip v-if="item.tag" class="ma-1">
                  {{ item.tag.code }}
                </v-chip>  
              </td>
              <td>
                <v-chip v-for="print in item.prints" class="ma-1">
                  {{ print.code }}
                </v-chip>
              </td>
              <td>
                <v-btn @click="editUser(item.id)" color="info" class="ma-1">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn @click="deleteUser(item.name)" color="error" class="ma-1">
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-btn @click="navigateTo('/create')" color="success" class="mt-4">
          Create
        </v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>