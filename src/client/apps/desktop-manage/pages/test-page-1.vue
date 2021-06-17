<template lang="pug">
a-button.m-10(type='primary' @click='onBack') back
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
export default defineComponent({
    setup() {
        const navigate = inject('navigate') as any
        const onBack = () => {
            navigate.back()
        }
        return { onBack }
    }
})
</script>
