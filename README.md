# Vue.js 3 typeahead component for Bootstrap 4/5

Born as a fork of [vue3-simple-typeahead](https://github.com/frikinside/vue3-simple-typeahead) (thanks man 👍🏻), later rebuilt with composition API.

Tested with Bootstrap from version 4.6.1 to 5.3.0.  
Works fine with the only Boostrap **CSS**, no Bootstrap JS library required.

This component is distributed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

## Features

- Composition API
- Autocomplete
- Match highlighter
- REST API data source
- Slot template
- Item projection
- Styling
- Events
- Keystrokes

## Add component to your app

Install the package:

`npm install -D vue3-bootstrap-typeahead`

Then import it in your components or views:

```javascript
import TypeAhead from "vue3-bootstrap-typeahead";
```

You can also import it globally:

```javascript
...
import TypeAhead from "vue3-bootstrap-typeahead";

let app = createApp(App);
app.component('TypeAhead', TypeAhead);
...
app.mount('#app');
```

## Demo
Please vist [demo page](https://www.devangarde.it/vue3-bootstrap-typeahead/) to see the component in action 😎

## Usage

### Basic example

```xml
<TypeAhead
	:items="['Black','Blue','Brown','Cyan','Gray','Green','Lime','Magenta','Orange','Red','Yellow']"
	v-model="color"
/>
```

### Fetching items remotely

```xml
<template>
	<TypeAhead
		:items="countries"
		v-model="country"
		@request:fired="loading = true"
		@request:completed="loading = false"
		@request:canceled="loading = false"
	/>
	<div v-show="loading">Loading data...</div>
</template>

<script>
export default {
	...
	methods: {
		countries(query) {
			if (!query) return;
			return fetch("https://restcountries.com/v3.1/name/" + query).then(res => {
				return res.json();
			});
		},
	}
}
</script>
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
| :------------------------------------------------ | :---------------- | :------------------------- | :------------------------------------------------------------------- |
| [`allowNew`](#allowNew)         | Boolean  | `false` | When `true` values not present in `items` are kept, when `false` are discarded |
| [`clearable`](#clearable)       | Boolean  | `false` | Show the times icon on the right corner of the element to clear its content |
| [`disabled`](#disabled)         | Boolean  | `false` | Makes the element `disabled` |
| [`itemProjection`](#itemProjection)               | Function: String  | `(item) => {return item;}` | Projection function to map the items to a string value for search and display  |
| [`immediate`](#immediate)         | Boolean  | `false` | Together with `allowNew` enabled, updates the `modelValue` on each keystroke |
| [`items`](#items)                                 | Array or function(query): Promise (Required)  |           | Array of objects or strings with the elements for suggestions, or function returning a Promise |
| [`maxItems`](#maxItems)                           | Number            | `-1`                       | Maximum items to show, the prop value has to be != 0 (`-1` means _show all_)            |
| [`minInputLength`](#minInputLength)               | Number            | `2`                        | Minimum input length for the suggestion length to appear, the prop value has to be >= 0 |
| [`placeholder`](#placeholder)                     | String            |                            | Placeholder text for the input                          |
| [`readonly`](#readonly)         | Boolean  | `false` | Makes the element `readonly` |
| [`requestDelay`](#requestDelay) | Number  | `250` | Used in conjuction with item function, delays the function call after a keystroke (time in milliseconds). Safe to set to `0` when the item function is not fetching data remotely |
| [`v-model`](#v-model)                             | Vue data variable |        | Vue data binding. For special needs `modelValue` property and `update:modelValue` event can be used as well |
| [`inputClass`](#inputClass)                       | String            | `form-control`             | `<input>` element class      |
| [`dropdownClass`](#dropdownClass)                 | String            | `dropdown`                 | Outer element class         |
| [`dropdownMenuClass`](#dropdownMenuClass)         | String            | `dropdown-menu`            | List class    |
| [`dropdownItemClass`](#dropdownItemClass)         | String            | `dropdown-item`            | Item class         |
| [`currentSelectionClass`](#currentSelectionClass) | String            | `active`                   | In addition to `dropdownItemClass`      |

### Events

| Event                       | Signature                                                        | Description                                                                                         |
| :-------------------------- | :--------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- |
| [`onFocus`](#onFocus)       | `function (event: Object { input: String, items: Array }): void` | Emitted when the input control get the focus                                                        |
| [`onBlur`](#onBlur)         | `function (event: Object { input: String, items: Array }): void` | Emitted when the input control lost the focus [When the user select an item, the focus is lost too] |
| [`request:queued`](#request-queued)         | `function (query, timeoutID): void` | Emitted when the items function is queued |
| [`request:fired`](#request-fired)         | `function (query): void` | Emitted when the items function is fired |
| [`request:completed`](#request-completed)         | `function (query): void` | Emitted when the items function Promise is resolved |
| [`request:canceled`](#request-canceled)         | `function (timeoutID): void` | Emitted when the queued items function is canceled due to a keystroke pressed during the [requestDelay](#requestDelay) time |
| [`request:failed`](#request-failed)         | `function (Exception): void` | Emitted when the items function promise fails |

### Slot

| Slot             | Props                                     | Description                                         |
| :--------------- | :---------------------------------------- | :-------------------------------------------------- |
| [`#item`](#item) | `item`, `itemProjection`, `boldMatchText` | Slot to customize the content of the `<li>` element |

#### Slot `#item` props

| Prop                                | Type             | Description                                                                                  |
| :---------------------------------- | :--------------- | :------------------------------------------------------------------------------------------- |
| [`item`](#item)                     | String or Object | The item of the items array                                                                  |
| [`itemProjection`](#itemProjection) | function         | Use the item projection function provided as prop to the component                           |
| [`boldMatchText`](#boldMatchText)   | function         | Receives a string and add `<strong>` to the parts of the text matched by the search criteria |
