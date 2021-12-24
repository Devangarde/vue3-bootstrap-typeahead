# Vue.js 3 Bootstrap 4.x / 5.x Typeahead

Fork of [vue3-simple-typeahead](https://github.com/frikinside/vue3-simple-typeahead) (thanks man 👍🏻).

Tested with Bootstrap 4.6.1 and 5.1.3.

No Bootstrap javascript library is required. Only **CSS** is needed.

## Add component to your app

Global registration:

```javascript
...
import Typeahead from "@/components/Typeahead.vue";

let app = createApp(App);
app.component('Typeahead', Typeahead);
...
app.mount('#app');
```

Local registration:

```javascript
import Typeahead from "@/components/Typeahead.vue";

export default {
	components: {
		...
		Typeahead
	}
	...
}
```

## Usage

Basic example:

```xml
<Typeahead
	:items="['Apple','Banana','Orange']"
	v-model="fruit"
	placeholder="Type something..."
/>
```

With some more options, complex data and custom slots template:

```xml
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
```

Where `items` is:
```javascript
[
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
```

### User interaction

When the user types on the typeahead input and the minimum input length is meeted a suggestion list appears below the input with the items that match the user input.
You can continue to type further to filter the selection, but you could use keyboard or mouse input to make your selection.

When the suggestion list show up, you can continue to type to filter the selection or you use the `Arrow Up`<kbd>↑</kbd> or `Arrow Down`<kbd>↓</kbd> keys to navigate the list of suggestions. When you have selected the desired element press <kbd>Enter</kbd> or <kbd>TAB</kbd> to select the current element.

| Control          | Effect                                                                       |
| :--------------- | :--------------------------------------------------------------------------- |
| <kbd>↑</kbd>     | Navigate up on the suggestion list, selecting the previous element           |
| <kbd>↓</kbd>     | Navigate down on the suggestion list, selecting the next element             |
| <kbd>Enter</kbd> | Choose the current element selection                                         |
| <kbd>TAB</kbd>   | Choose the current element selection and give focus to the next form control |
| <kbd>ESC</kbd>   | Close the dropdown and blur element                                          |

You can use the mouse instead, simply hover you cursor over the desire element and click on it.

### Props

| Prop                                              | Type              | Default                    | Description                                                                             |
| :------------------------------------------------ | :---------------- | :------------------------- | :-------------------------------------------------------------------------------------- |
| [`id`](#id)                                       | String            | Random id                  | The id for the input control. Can be useful to link with a `label for=""`               |
| [`placeholder`](#placeholder)                     | String            |                            | Placeholder text for the input                                                          |
| [`items`](#items)                                 | Array (Required)  |                            | List of objects or strings with the elements for suggestions                            |
| [`v-model`](#v-model)                             | String (Required) |                            | Vue data binding                                                                        |
| [`minInputLength`](#minInputLength)               | Number            | `2`                        | Minimum input length for the suggestion length to appear, the prop value has to be >= 0 |
| [`maxItems`](#maxItems)                           | Number            | `-1`                       | Maximum items to show, the prop value has to be != 0 (`-1` means _show all_)            |
| [`itemProjection`](#itemProjection)               | Function: String  | `(item) => {return item;}` | Projection function to map the items to a string value for search and display           |
| [`inputClass`](#inputClass)                       | String            | `form-control`             | `<input>` element class                                                                 |
| [`dropdownClass`](#dropdownClass)                 | String            | `dropdown`                 | Outer element class                                                                     |
| [`dropdownMenuClass`](#dropdownMenuClass)         | String            | `dropdown-menu`            | List class                                                                              |
| [`dropdownItemClass`](#dropdownItemClass)         | String            | `dropdown-item`            | Item class                                                                              |
| [`currentSelectionClass`](#currentSelectionClass) | String            | `active`                   | In addition to `dropdownItemClass`                                                      |


### Events

| Event                       | Signature                                                        | Description                                                                                         |
| :-------------------------- | :--------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- |
| [`onFocus`](#onFocus)       | `function (event: Object { input: String, items: Array }): void` | Emitted when the input control get the focus                                                        |
| [`onBlur`](#onBlur)         | `function (event: Object { input: String, items: Array }): void` | Emitted when the input control lost the focus [When the user select an item, the focus is lost too] |

### Slots

| Slot             | Parent                                    | Description                                         |
| :--------------- | :---------------------------------------- | :-------------------------------------------------- |
| [`#item`](#item) | `item`, `itemProjection`, `boldMatchText` | Slot to customize the content of the `<li>` element |

#### Slot `#item` props

| Prop                                | Type             | Description                                                                                  |
| :---------------------------------- | :--------------- | :------------------------------------------------------------------------------------------- |
| [`item`](#item)                     | String or Object | The item of the items array                                                                  |
| [`itemProjection`](#itemProjection) | function         | Use the item projection function provided as prop to the component                           |
| [`boldMatchText`](#boldMatchText)   | function         | Receives a string and add `<strong>' to the parts of the text matched by the search criteria |
