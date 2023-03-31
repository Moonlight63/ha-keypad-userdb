<script lang="ts" setup>
import { useVuelidate } from "@vuelidate/core";
import {
  alpha,
  maxLength,
  minLength,
  numeric,
  required,
} from "@vuelidate/validators";

const props = defineProps({
  modelValue: {
    type: Object as PropType<{ code: string }>,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  errors: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["remove", "update:modelValue"]);

const runtimeValues = useRuntimeConfig().public;

const rules = {
  code: {
    required,
    minLength: minLength(parseInt(runtimeValues.printCodeLength, 10)),
    maxLenth: maxLength(parseInt(runtimeValues.printCodeLength, 10)),
    numeric,
  },
};

const $v = useVuelidate(rules, toRef(props, "modelValue"), {
  $externalResults: toRef(props, "errors"),
});
</script>

<template>
  <v-text-field
    :error-messages="$v.code.$errors[0]?.$message.toString() || undefined"
    :counter="parseInt(runtimeValues.printCodeLength, 10)"
    v-model="$v.code.$model"
    :label="props.label"
    append-icon="mdi-close"
    @click:append="emit('remove')"
  ></v-text-field>
</template>
