<template>
	<div :id="wrapperId" :class="this.dropdownClass">
		<input
			:id="this.id"
			:class="this.inputClass"
			type="text"
			:placeholder="placeholder"
			v-model="this.value"
			@focus="onFocus"
			@blur="onBlur"
			@keydown.down.prevent="onArrowDown"
			@keydown.up.prevent="onArrowUp"
			@keydown.enter.prevent="selectCurrentSelection"
			@keydown.tab="selectCurrentSelection"
			@keydown.esc.prevent="close"
			autocomplete="off"
		/>
		<ul :style="isListVisible ? 'display:block' : ''" :class="this.dropdownMenuClass">
			<li
				:class="this.dropdownItemClass + (currentSelectionIndex == index ? ' ' + this.currentSelectionClass : '')"
				v-for="(item, index) in filteredItems"
				:key="index"
				@mousedown.prevent
				@click="selectItem(item)"
				@mouseenter="currentSelectionIndex = index"
			>
				<span :data-text="itemProjection(item)" v-if="$slots['item']">
					<slot name="item" :item="item" :itemProjection="itemProjection" :boldMatchText="boldMatchText"></slot>
				</span>
				<span :data-text="itemProjection(item)" v-html="boldMatchText(itemProjection(item))" v-else></span>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'Typeahead',
	emits: ['update:modelValue', 'onFocus', 'onBlur'],
	props: {
		modelValue: {
			type: String
		},
		id: {
			type: String,
			default: 'typeahead-' + parseInt(Math.random() * Math.pow(1000, 2))
		},
		placeholder: {
			type: String,
			default: ''
		},
		items: {
			type: Array
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
		inputClass: {
			type: String,
			default: 'form-control'
		},
		dropdownClass: {
			type: String,
			default: 'dropdown'
		},
		dropdownMenuClass: {
			type: String,
			default: 'dropdown-menu'
		},
		dropdownItemClass: {
			type: String,
			default: 'dropdown-item'
		},
		currentSelectionClass: {
			type: String,
			default: 'active'
		}
	},
	data() {
		return {
			isInputFocused: false,
			currentSelectionIndex: 0
		};
	},
	methods: {
		onFocus() {
			this.isInputFocused = true;
			this.$emit('onFocus', { value: this.modelValue, items: this.filteredItems });
		},
		onBlur() {
			this.isInputFocused = false;
			this.$emit('onBlur', { value: this.modelValue, items: this.filteredItems });
		},
		onArrowDown() {
			if (this.isListVisible && this.currentSelectionIndex < this.filteredItems.length - 1) {
				this.currentSelectionIndex++;
			}
			this.scrollSelectionIntoView();
		},
		onArrowUp() {
			if (this.isListVisible && this.currentSelectionIndex > 0) {
				this.currentSelectionIndex--;
			}
			this.scrollSelectionIntoView();
		},
		close() {
			document.getElementById(this.id).blur();
		},
		scrollSelectionIntoView() {
			setTimeout(() => {
				const list_node = document.querySelector(`#${this.wrapperId} .dropdown-menu`);
				const active_node = document.querySelector(`#${this.wrapperId} .active`);

				if (!(active_node.offsetTop >= list_node.scrollTop && active_node.offsetTop + active_node.offsetHeight < list_node.scrollTop + list_node.offsetHeight)) {
					let scroll_to = 0;
					if (active_node.offsetTop > list_node.scrollTop) {
						scroll_to = active_node.offsetTop + active_node.offsetHeight - list_node.offsetHeight;
					} else if (active_node.offsetTop < list_node.scrollTop) {
						scroll_to = active_node.offsetTop;
					}

					list_node.scrollTo(0, scroll_to);
				}
			});
		},
		selectCurrentSelection() {
			if (this.currentSelection) {
				this.selectItem(this.currentSelection);
			}
		},
		selectItem(item) {
			this.currentSelectionIndex = 0;
			this.close();
			this.$emit('update:modelValue', this.itemProjection(item));
		},
		escapeRegExp(string) {
			return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		},
		boldMatchText(text) {
			const regexp = new RegExp(`(${this.escapeRegExp(this.modelValue)})`, 'ig');
			return text.replace(regexp, '<strong>$1</strong>');
		},
	},
	computed: {
		wrapperId() {
			return `${this.id}-wrapper`;
		},
		filteredItems() {
			if (this.modelValue && this.items) {
				const regexp = new RegExp(this.escapeRegExp(this.modelValue), 'i');
				const filtered = this.items.filter((item) => this.itemProjection(item).match(regexp));
				return (this.$props.maxItems < 0 ? filtered : filtered.slice(0, this.$props.maxItems));
			} else {
				return [];
			}
		},
		isListVisible() {
			return this.isInputFocused && (this.modelValue || '').length >= this.minInputLength && this.filteredItems.length;
		},
		currentSelection() {
			return this.isListVisible && this.currentSelectionIndex < this.filteredItems.length ? this.filteredItems[this.currentSelectionIndex] : undefined;
		},
		value: {
			get() {
				return this.$props.modelValue;
			},
			set(value) {
				if (this.isListVisible && this.currentSelectionIndex >= this.filteredItems.length) {
					this.currentSelectionIndex = (this.filteredItems.length || 1) - 1;
				}
				this.$emit('update:modelValue', value);
			}
		}
	},
};
</script>