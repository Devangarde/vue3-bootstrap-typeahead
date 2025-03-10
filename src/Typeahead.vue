<script setup>
import { computed, ref, reactive, watch } from "vue";

const DEBUG = false;

const emit = defineEmits([ 'update:modelValue', 'onFocus', 'onBlur', 'request:queued', 'request:fired', 'request:completed', 'request:canceled', 'request:failed' ]);
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
	readonly: {
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
	},
	clearable: {
		type: Boolean,
		default: false
	},
	immediate: {
		type: Boolean,
		default: false
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
const clearElement = ref();

const currentValue = computed(() => state.hasFocus ? buffer.value : props.itemProjection(props.modelValue) );
const menuVisible = computed(() => state.hasFocus && (buffer.value || '').length >= props.minInputLength && filteredItems.value.length > 0 );
const currentSelection = computed(() => menuVisible && state.index != -1 && state.index < filteredItems.value.length ? filteredItems.value[state.index] : undefined );

const buffer = ref(null);
watch(buffer, (newValue, oldValue) => {
	if (DEBUG) console.log('watch buffer from: ' + (oldValue === null ? 'NULL' : oldValue) + ' to: ' + (newValue === null ? 'NULL' : newValue) + ' state.hasFocus: ' + state.hasFocus);
	state.index = -1;
	buffer.value = newValue;
	if (state.hasFocus && props.allowNew && props.immediate) emit('update:modelValue', buffer.value);
	if (state.hasFocus) filterItems();
});

const onFocus = () => {
	if (DEBUG) console.log('onFocus');
	if (props.readonly) return;
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
	if (DEBUG) console.log('onBlur');
	if (props.readonly) return;
	state.hasFocus = false;
	filteredItems.value = [];
	if (!state.onBlurIgnoreBuffer) {
		if (props.allowNew && (buffer.value || '').length > 0) {
			const match = filteredItems.value.find((item) => props.itemProjection(item).toLowerCase() == buffer.value.toLowerCase());
			if (DEBUG) console.log({ selectingMatch: match, buffer: buffer.value });
			selectItem(match !== undefined ?
				props.itemProjection(match) :
				buffer.value
			);
		} else if ((buffer.value || '').length == 0 && (props.itemProjection(props.modelValue) || '').length > 0) {
			selectItem(null);
		}
		buffer.value = null;
	} else {
		buffer.value = null;
		state.onBlurIgnoreBuffer = false;
	}
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
	if (DEBUG) console.log('close');
	if (!state.onBlurIgnoreBuffer && event instanceof KeyboardEvent && event.code === 'Escape') {
		if (DEBUG) console.log('close ignore buffer');
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
		menuElement.value.scrollTo(0, () => {
			if (activeNode.offsetTop > menuNode.scrollTop) return activeNode.offsetTop + activeNode.offsetHeight - menuNode.offsetHeight;
			if (activeNode.offsetTop < menuNode.scrollTop) return activeNode.offsetTop;
			return 0;
		});
	});
};
const selectCurrentSelection = (event) => {
	if (state.index === -1) return;
	if (event instanceof KeyboardEvent && event.code === 9) event.preventDefault();
	if (currentSelection.value) selectItem(currentSelection.value);
};
const selectItem = (item) => {
	if (DEBUG) console.log('selectItem');
	state.index = -1;
	state.onBlurIgnoreBuffer = true;
	close();
	emit('update:modelValue', item);
};
const clear = () => {
	if (DEBUG) console.log('clear');
	inputElement.value.focus();
	buffer.value = '';
	inputElement.value.blur();
}

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
	if (DEBUG) console.log('filterItems');

	filteredItems.value = [];
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

<template>
	<div ref="wrapperElement" :class="props.dropdownClass">
		<input
			ref="inputElement"
			type="text"
			:class="props.inputClass"
			:placeholder="placeholder"
			:value="currentValue"
			:disabled="props.disabled"
			:readonly="props.readonly"
			:style="props.clearable ? 'padding-right: 2rem' : ''"
			@focus="onFocus"
			@blur="onBlur"
			@keydown.down.prevent.stop="onArrowDown"
			@keydown.up.prevent.stop="onArrowUp"
			@keydown.enter.prevent.stop="selectCurrentSelection"
			@keydown.tab.stop="selectCurrentSelection"
			@keydown.esc.prevent.stop="close"
			@keypress="buffer = $event.target.value"
			@input="buffer = $event.target.value"
			autocomplete="off"
		/>
		<div v-if="props.clearable" ref="clearElement" class="d-flex position-absolute top-0 bottom-0 align-items-center" style="right: 0.5rem">
			<button type="button" class="btn-close" aria-label="Clear" @click.prevent="clear" :disabled="!currentValue" style="transform: scale(0.75)"></button>
		</div>
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