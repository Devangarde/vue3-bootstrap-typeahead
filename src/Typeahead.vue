<template>
	<div ref="wrapperElement" :class="props.dropdownClass">
		<input
			ref="inputElement"
			type="text"
			:class="props.inputClass"
			:placeholder="placeholder"
			:value="currentValue"
			:disabled="props.disabled"
			@focus="onFocus"
			@blur="onBlur"
			@keydown.down.prevent="onArrowDown"
			@keydown.up.prevent="onArrowUp"
			@keydown.enter.prevent="selectCurrentSelection"
			@keydown.tab="selectCurrentSelection"
			@keydown.esc.prevent="close"
			@keypress="buffer = $event.target.value"
			@input="buffer = $event.target.value"
			autocomplete="off"
		/>
		<ul ref="menuElement" :style="menuVisible ? 'display:block' : ''" :class="props.dropdownMenuClass">
			<template v-for="(item, index) in filteredItems" :key="index">
				<li
					v-if="$slots['item']"
					:class="props.dropdownItemClass + (state.index == index ? ' ' + currentSelectionClass : '')"
					@mousedown.prevent
					@click="selectItem(item)"
					@mouseenter="state.index = index">
					<template v-if="$slots['item']">
						<slot name="item" :item="item" :itemProjection="props.itemProjection" :boldMatchText="boldMatchText"></slot>
					</template>
				</li>
				<li
					v-else
					v-html="boldMatchText(props.itemProjection(item))"
					:class="props.dropdownItemClass + (state.index == index ? ' ' + currentSelectionClass : '')"
					@mousedown.prevent
					@click="selectItem(item)"
					@mouseenter="state.index = index"></li>
			</template>
		</ul>
	</div>
</template>

<script setup>
import { computed, ref, reactive, watch } from "vue";

const emit = defineEmits([ 'update:modelValue', 'onFocus', 'onBlur', 'request:queued', 'request:fired', 'request:completed', 'request:canceled' ]);
const props = defineProps({
	modelValue: [String, Object],
	placeholder: {
		type: String,
		default: ''
	},
	items: {
		type: [ Array, Function ]
	},
	itemProjection: {
		type: Function,
		default(item) {
			return item;
		}
	},
	minInputLength: {
		type: Number,
		default: 2,
		validator: prop => { return prop >= 0 }
	},
	maxItems: {
		type: Number,
		default: -1,
		validator: prop => { return prop != 0 }
	},
	allowNew: {
		type: Boolean,
		default: false
	},
	disabled: {
		type: Boolean,
		default: false
	},
	requestDelay: {
		type: Number,
		default: 250,
		validator: prop => { return prop >= 0 }
	},
	inputClass: {
		type: [ String, Object ],
		default: 'form-control'
	},
	dropdownClass: {
		type: [ String, Object ],
		default: 'dropdown'
	},
	dropdownMenuClass: {
		type: [ String, Object ],
		default: 'dropdown-menu'
	},
	dropdownItemClass: {
		type: [ String, Object ],
		default: 'dropdown-item'
	},
	currentSelectionClass: {
		type: [ String, Object ],
		default: 'active'
	}
});

const state = reactive({
	index: -1,
	hasFocus: false,
	onBlurIgnoreBuffer: false,
	requestTimeout: null,
	value: null
});

const wrapperElement = ref();
const inputElement = ref();
const menuElement = ref();

const currentValue = computed(() => state.hasFocus ? buffer.value : props.itemProjection(props.modelValue) );
const menuVisible = computed(() => state.hasFocus && (buffer.value || '').length >= props.minInputLength && filteredItems.value.length > 0 );
const currentSelection = computed(() => menuVisible && state.index != -1 && state.index < filteredItems.value.length ? filteredItems.value[state.index] : undefined );

const buffer = ref(null);
watch(buffer, (newvalue) => {
	state.index = -1;
	buffer.value = newvalue;
	filterItems();
});

const onFocus = () => {
	state.hasFocus = true;
	state.onBlurIgnoreBuffer = false;
	buffer.value = props.itemProjection(props.modelValue);
	if (props.minInputLength == 0) filterItems();
	emit('onFocus', {
		value: props.modelValue,
		items: filteredItems.value
	});
};
const onBlur = () => {
	state.hasFocus = false;
	filteredItems.value = [];
	if (!state.onBlurIgnoreBuffer) {
		if (props.allowNew && (buffer.value || '').length > 0) {
			const match = props.items.filter((item) => props.itemProjection(item).toLowerCase() == buffer.value.toLowerCase());
			selectItem(match.length > 0 ?
				props.itemProjection(match[0]) :
				buffer.value
			);
		} else if ((buffer.value || '').length == 0 && (props.itemProjection(props.modelValue) || '').length > 0) {
			selectItem(null);
		}
	} else {
		state.onBlurIgnoreBuffer = false;
	}
	buffer.value = null;
	emit('onBlur', {
		value: props.modelValue,
		items: filteredItems.value
	});
};
const onArrowDown = () => {
	if (menuVisible && state.index < filteredItems.value.length - 1) state.index++;
	scrollSelectionIntoView();
};
const onArrowUp = () => {
	if (menuVisible && state.index > -1) state.index--;
	scrollSelectionIntoView();
};
const close = (event) => {
	if (event instanceof KeyboardEvent && event.code === 'Escape') {
		buffer.value = props.modelValue;
		state.onBlurIgnoreBuffer = true;
	}
	inputElement.value.blur();
};
const scrollSelectionIntoView = () => {
	setTimeout(() => {
		if (state.index < 0) return;
		const activeNode = wrapperElement.value.querySelector('.active');
		const menuNode = menuElement.value;
		
		if (activeNode.offsetTop >= menuElement.value.scrollTop && activeNode.offsetTop + activeNode.offsetHeight < menuNode.scrollTop + menuNode.offsetHeight) return;
		const scroll_to = () => {
			if (activeNode.offsetTop > menuNode.scrollTop) return activeNode.offsetTop + activeNode.offsetHeight - menuNode.offsetHeight;
			if (activeNode.offsetTop < menuNode.scrollTop) return activeNode.offsetTop;
			return 0;
		}
		menuElement.value.scrollTo(0, scroll_to());
	});
};
const selectCurrentSelection = (event) => {
	if (state.index === -1) return;
	if (event instanceof KeyboardEvent && event.code === 9) event.preventDefault();
	if (currentSelection.value) selectItem(currentSelection.value);
};
const selectItem = (item) => {
	state.index = -1;
	state.onBlurIgnoreBuffer = true;
	close();
	emit('update:modelValue', item);
};

const escapeRegExp = (text) => {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
const boldMatchText = (text) => {
	if (!currentValue.value) return text;
	const regexp = new RegExp(`(${escapeRegExp(currentValue.value)})`, 'ig');
	return text.replace(regexp, '<strong>$1</strong>');
};

const filteredItems = ref([]);
const filterItems = () => {
	if ((currentValue.value || '').length < props.minInputLength) return;
	
	const loadItems = (items) => { filteredItems.value = (props.maxItems < 0 ? items : items.slice(0, props.maxItems)); }
	const regexp = (currentValue.value ? new RegExp(escapeRegExp(currentValue.value), 'i') : null);
	if (Array.isArray(props.items)) {
		loadItems(currentValue.value ?
			props.items.filter((item) => props.itemProjection(item).match(regexp)) :
			props.items
		);
	} else if (typeof props.items === 'function') {
		if (state.requestTimeout !== null) {
			emit("request:canceled", state.requestTimeout);
			clearTimeout(state.requestTimeout);
		}
		if ((currentValue.value || '').length > 0 || props.minInputLength == 0) {
			state.requestTimeout = setTimeout(() => {
				state.requestTimeout = null;
				emit("request:fired", currentValue.value || null);
				const request = props.items(currentValue.value || null);
				if (request) {
					request.then(res => {
						emit("request:completed", currentValue.value || null);
						loadItems(res);
					}).catch(err => emit("request:failed", err) );
				} else {
					loadItems([]);
				}
			}, props.requestDelay);
			emit("request:queued", currentValue.value || null, props.requestTimeout);
		}
	}
};
</script>