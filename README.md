# Vue.js 3 Bootstrap 4.x / 5.x Typeahead

Fork of [vue3-simple-typeahead](https://github.com/frikinside/vue3-simple-typeahead) (thanks man 👍🏻).

Tested with Bootstrap 4.6.1 and 5.1.3.  
Works just fine with the only Boostrap **CSS**.

## Features

- Autocomplete
- Match highlighter
- REST API data source
- Slot template
- Item projection
- Styling
- Events
- Keystrokes

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

## Demo
Please vist [demo page](https://www.devangarde.it/vue3-bootstrap-typeahead/) to see the component in action 😎

## Usage

### Basic example

```xml
<Typeahead
	:items="['Black','Blue','Brown','Cyan','Gray','Green','Lime','Magenta','Orange','Red','Yellow']"
	v-model="color"
/>
```

### Fetching items remotely

```xml
<template>
	<Typeahead
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
| [`placeholder`](#placeholder)                     | String            |                            | Placeholder text for the input                          |
| [`items`](#items)                                 | Array or function(query): Promise (Required)  |           | Array of objects or strings with the elements for suggestions, or function returning a Promise |
| [`v-model`](#v-model)                             | Vue data variable |        | Vue data binding. For special needs `modelValue` property and `update:modelValue` event can be used as well |
| [`minInputLength`](#minInputLength)               | Number            | `2`                        | Minimum input length for the suggestion length to appear, the prop value has to be >= 0 |
| [`maxItems`](#maxItems)                           | Number            | `-1`                       | Maximum items to show, the prop value has to be != 0 (`-1` means _show all_)            |
| [`allowNew`](#allowNew)               | Boolean  | `false` | When `true` values not present in `items` are kept, when `false` are discarded |
| [`requestDelay`](#requestDelay)               | Number  | `250` | Used in conjuction with item function, delays the function call after a keystroke (time in milliseconds). Safe to set to `0` when the item function is not fetching data remotely |
| [`itemProjection`](#itemProjection)               | Function: String  | `(item) => {return item;}` | Projection function to map the items to a string value for search and display  |
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
| [`request:queued`](#request:queued)         | `function (query, timeoutID): void` | Emitted when the items function is queued |
| [`request:fired`](#request:fired)         | `function (query): void` | Emitted when the items function is fired |
| [`request:completed`](#request:completed)         | `function (query): void` | Emitted when the items function Promise is resolved |
| [`request:canceled`](#request:canceled)         | `function (timeoutID): void` | Emitted when the queued items function is canceled due to a keystroke pressed during the [requestDelay](#requestDelay) time |

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

## Get started

Clone the repository and download the dependencies with `npm install` then run the demo with `npm run serve`.