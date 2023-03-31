<script lang="ts" setup>
import { TRPCClientError } from '@trpc/client';
import { ValidationIssues } from '~~/server/trpc/trpc';

import { useVuelidate } from '@vuelidate/core'
import { alpha, maxLength, minLength, numeric, required } from '@vuelidate/validators'
import PrintForm from '~~/components/printForm.vue';
import { propsToAttrMap } from '@vue/shared';

const props = defineProps({
  userid: {
    type: String,
    default: undefined,
  },
  name: {
    type: String,
    default: '',
  },
  code: {
    type: String,
    default: '',
  },
  tag: {
    type: String,
    default: '',
  },
  prints: {
    type: Array as PropType<Array<{code: string}>>,
    default: []
  }
})

const $externalResults = ref<any>({})

const prints = reactive(props.prints || [])

const state = reactive({
  name: props.name || '',
  code: props.code || '',
  tag: props.tag || ''
})

const runtimeValues = useRuntimeConfig().public

console.log("🚀 ~ file: userForm.vue:40 ~ runtimeValues:", runtimeValues)

const rules = {
  name: { required, minLength: minLength(3), alpha },
  code: { minLength: minLength(parseInt(runtimeValues.pinLength, 10)), maxLenth: maxLength(parseInt(runtimeValues.pinLength, 10)), numeric },
  tag: { minLength: minLength(parseInt(runtimeValues.rfidLength, 10)), maxLenth: maxLength(parseInt(runtimeValues.rfidLength, 10)), numeric }
}

const $v = useVuelidate(rules, state, { $externalResults, $scope: false })

function close() {
  navigateTo('/')
}

//function to remove element from the prints array by index
function removePrintByIndex(index: number) {
  prints.splice(index, 1)
}

//Validate the form
async function submitForm () {
  const isFormCorrect = await $v.value.$validate()
  
  if (!isFormCorrect) return
  // I am super lazy and don't feel like figuring out which fields actually changed.
  // So I just delete the user and re-create it.
  try {
    if (props.name != '')
      await useNuxtApp().$client.user.deleteUser.mutate(props.name as string)
    await useNuxtApp().$client.user.addNewUser.mutate({
      id: props.userid,
      name: state.name,
      code: state.code,
      tag: state.tag,
      prints: prints.map(print => print.code)
    })
    close()
  } catch (e) {
    if (e instanceof TRPCClientError && e.data.validationIssues as ValidationIssues ) {
      $externalResults.value = e.data.validationIssues
      console.log("🚀 ~ file: create.vue:79 ~ submitForm ~ e.data.validationIssues:", e.data.validationIssues)
    }
    
    if (e instanceof TRPCClientError && e.data.zodError ) {
      $externalResults.value = e.data.zodError.fieldErrors
      console.log("🚀 ~ file: create.vue:83 ~ submitForm ~ e.data.zodError:", e.data.zodError.fieldErrors)
    }
  }
}

</script>

<template>
  <form @submit.prevent="submitForm">
    <v-text-field
      v-model="$v.name.$model"
      :counter="20"
      :error-messages="$v.name.$errors[0]?.$message.toString() || undefined"
      label="Name"
    ></v-text-field>

    <v-row>
      <v-col cols="6">
        <v-text-field
          v-model="$v.code.$model"
          :counter="parseInt(runtimeValues.pinLength, 10)"
          :error-messages="$v.code.$errors[0]?.$message.toString() || undefined"
          label="Pin Code"
        ></v-text-field>
      </v-col>

      <v-col cols="6">
        <v-text-field
          v-model="$v.tag.$model"
          :error-messages="$v.tag.$errors[0]?.$message.toString() || undefined"
          :counter="parseInt(runtimeValues.rfidLength, 10)"
          label="RFID Tag"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-col cols="6" v-if="prints.length">
      <print-form
        v-for="(print, index) in prints"
        :key="index"
        :model-value="print"
        :errors="$externalResults?.prints?.[index] || {}"
        :label="`Print ${index + 1}`"
        @remove="removePrintByIndex(index)" />
    </v-col>

    <v-btn
      class="me-4"
      @click="prints.push({code:''})"
      color="secondary"
    >
      add print
    </v-btn>

    <v-btn
      class="me-4"
      type="submit"
      color="info"
    >
      submit
    </v-btn>

    <v-btn @click="close" color="error">
      Cancel
    </v-btn>
  </form>
</template>