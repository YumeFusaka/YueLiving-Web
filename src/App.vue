<script setup lang="ts">
import { testAPI } from '@/apis/test'
const test = async () => {
  const res = await testAPI()
  console.log(res)
}
</script>

<template>
  <div>
    <button @click="test">test</button>
  </div>
</template>

<style scoped></style>
