<template>
	<div class="container py-4">
		<div class="mb-3">
			<Typeahead
				id="fruit"
				v-model="fruit"
				placeholder="Type something..."
				:items="items.map(item => { return item.name })"
				minInputLength="1"
				maxItems="3"
				:itemProjection="itemProjectionFunction"
				currentSelectionClass="bg-light text-black"
				@onFocus="onFocusEventHandler"
				@onBlur="onBlurEventHandler">
				<template #item="slot">
					<span class="me-1">{{ items.filter(item => { return item.name == slot.item }).at(0).emoji }}</span>
					<span v-html="slot.boldMatchText(slot.itemProjection(slot.item))"></span>
				</template>
			</Typeahead>
		</div>
		<div v-if="fruit.length > 0" class="card">
			<div class="card-body">
				<strong>{{ fruit }}</strong>, good choice!
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'App',
	data() {
		return {
			fruit: '',
			items: [
				{
					name: 'Ananas',
					emoji: '🍍'
				},
				{
					name: 'Apple',
					emoji: '🍎'
				},
				{
					name: 'Banana',
					emoji: '🍌'
				},
				{
					name: 'Kiwi',
					emoji: '🥝'
				},
				{
					name: 'Orange',
					emoji: '🍊'
				},
				{
					name: 'Pear',
					emoji: '🍐'
				}
			]
		}
	}
}
</script>

<style>
@import "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css";
</style>
