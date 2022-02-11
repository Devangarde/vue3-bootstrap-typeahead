<template>
	<div ref="wrapper" :class="this.dropdownClass">
		<input
			ref="input"
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
			@keyup="filterItems"
			autocomplete="off"
		/>
		<ul :style="isListVisible ? 'display:block' : ''" :class="this.dropdownMenuClass">
			<template v-for="(item, index) in filteredItems" :key="index">
				<li
					v-if="$slots['item']"
					:class="this.dropdownItemClass + (currentSelectionIndex == index ? ' ' + this.currentSelectionClass : '')"
					@mousedown.prevent
					@click="selectItem(item)"
					@mouseenter="currentSelectionIndex = index">
					<template v-if="$slots['item']">
						<slot name="item" :item="item" :itemProjection="itemProjection" :boldMatchText="boldMatchText"></slot>
					</template>
				</li>
				<li
					v-else
					v-html="boldMatchText(itemProjection(item))"
					:class="this.dropdownItemClass + (currentSelectionIndex == index ? ' ' + this.currentSelectionClass : '')"
					@mousedown.prevent
					@click="selectItem(item)"
					@mouseenter="currentSelectionIndex = index"></li>
			</template>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'Typeahead',
	emits: ['update:modelValue', 'onFocus', 'onBlur', 'request:queued', 'request:fired', 'request:completed', 'request:canceled'],
	props: {
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
	},
	data() {
		return {
			buffer: null,
			isInputFocused: false,
			currentSelectionIndex: 0,
			filteredItems: [],
			requestTimeout: null
		};
	},
	methods: {
		onFocus() {
			this.isInputFocused = true;
			this.buffer = this.itemProjection(this.modelValue);
			if (this.minInputLength == 0) this.filterItems();
			this.$emit('onFocus', { value: this.modelValue, items: this.filteredItems });
		},
		onBlur() {
			this.isInputFocused = false;
			this.filteredItems = [];
			if (this.allowNew && (this.buffer || '').length > 0) this.selectItem(this.buffer);
			this.buffer = null;
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
			this.$refs.input.blur();
		},
		scrollSelectionIntoView() {
			setTimeout(() => {
				const list_node = this.$refs.wrapper.querySelector('.dropdown-menu');
				const active_node = this.$refs.wrapper.querySelector('.active');

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
			this.$emit('update:modelValue', item);
		},
		escapeRegExp(string) {
			return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		},
		boldMatchText(text) {
			if (this.value) {
				const regexp = new RegExp(`(${this.escapeRegExp(this.value)})`, 'ig');
				return text.replace(regexp, '<strong>$1</strong>');
			} else {
				return text;
			}
		},
		filterItems() {
			let ret = [];
			if ((this.value || '').length >= this.minInputLength) {
				const that = this;
				const loadItems = (items) => {
					that.filteredItems = (that.$props.maxItems < 0 ? items : items.slice(0, that.$props.maxItems));
				}
				const regexp = (this.value ? new RegExp(this.escapeRegExp(this.value), 'i') : null);
				if (Array.isArray(this.items)) {
					if (this.value) {
						ret = this.items.filter((item) => this.itemProjection(item).match(regexp));
					} else if (this.minInputLength == 0) {
						ret = this.items;
					}
					loadItems(ret);
				} else if (typeof this.items === 'function') {
					if (this.value || this.minInputLength == 0) {
						if (this.requestTimeout !== null) {
							this.$emit("request:canceled", this.requestTimeout);
							clearTimeout(this.requestTimeout);
						}
						this.requestTimeout = setTimeout(() => {
							that.requestTimeout = null;
							that.$emit("request:fired", that.value || null);
							const request = that.items(that.value || null);
							if (request) {
								request.then(res => {
									that.$emit("request:completed", that.value || null);
									loadItems(res);
								});
							} else {
								loadItems([]);
							}
						}, that.requestDelay);
						this.$emit("request:queued", this.value || null, this.requestTimeout);
					}
				}
			}
		}
	},
	computed: {
		isListVisible() {
			return this.isInputFocused && (this.value || '').length >= this.minInputLength && this.filteredItems.length;
		},
		currentSelection() {
			return this.isListVisible && this.currentSelectionIndex < this.filteredItems.length ? this.filteredItems[this.currentSelectionIndex] : undefined;
		},
		value: {
			get() {
				if (this.isInputFocused) {
					return this.buffer;
				} else {
					return this.itemProjection(this.modelValue);
				}
			},
			set(newvalue) {
				if (this.isListVisible && this.currentSelectionIndex >= this.filteredItems.length) {
					this.currentSelectionIndex = (this.filteredItems.length || 1) - 1;
				}
				this.buffer = newvalue;
			}
		}
	}
};
</script>