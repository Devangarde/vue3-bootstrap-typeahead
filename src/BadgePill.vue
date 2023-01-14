<template>
	<span :class="{
		'badge': true,
		'rounded-pill': true,
		'me-2': !isRest,
		'ms-2': isRest,
		'bg-info' : isEvent,
		'bg-success' : isSlot,
		'bg-danger' : isRest,
		'bg-primary' : !isEvent && !isSlot && !isRest
	}">{{ props.text }}</span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps([ 'text' ]);

const isEvent = computed(() => props.text.substring(0, 1) === '@');
const isSlot = computed(() => props.text === 'slot');
const isRest = computed(() => props.text === 'REST');
</script>