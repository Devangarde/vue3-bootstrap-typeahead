<template>
	<main>
		<div class="mb-4">
			Visit <a href="https://github.com/Devangarde/vue3-bootstrap-typeahead" title="Vue.js 3 typeahead component for Bootstrap on GitHub"><code>vue3-bootstrap-typeahead</code> on GitHub</a> to download sources and get the documentation.<br>
			What follow are some examples of the component in action in most common configurations.
		</div>

		<div class="card mb-4 shadow-sm">
			<div class="card-header text-uppercase bg-white border-0 fw-bold">USA States</div>
			<div class="card-body py-2">
				<Typeahead
					:maxItems="5"
					v-model="state"
					:items="states"
				/>
			</div>
			<div class="card-footer border-0 opacity-75 bg-white">
				<BadgePill v-for="(text, index) in [ 'items array', 'maxItems' ]" :key="index" :text="text" />
			</div>
		</div>

		<div class="card mb-4 shadow-sm">
			<div class="card-header text-uppercase bg-white border-0 fw-bold">Colors</div>
			<div class="card-body py-2">
				<Typeahead
					v-model="color"
					:allowNew="true"
					:items="['Aqua','Black','Blue','Cyan','Fuchsia','Gray','Green','Lime','Magenta','Maroon','Navy','Olive','Orange','Purple','Red','Silver','Teal','Yellow']"
					:minInputLength="1"
					dropdownItemClass="dropdown-item d-flex align-items-center">
					<template #item="slot">
						<div class="me-2" :style="{
							width: '1rem',
							height: '1rem',
							borderRadius: '50%',
							backgroundColor: slot.item
						}"></div>
						<div v-html="slot.boldMatchText(slot.itemProjection(slot.item))"></div>
					</template>
				</Typeahead>
			</div>
			<div class="card-footer border-0 opacity-75 bg-white">
				<BadgePill v-for="(text, index) in [ 'allowNew', 'items array', 'dropdownItemClass', 'minInputLength', 'slot' ]" :key="index" :text="text" />
			</div>
		</div>

		<div class="card mb-4 shadow-sm">
			<div class="card-header text-uppercase bg-white border-0 fw-bold">Solar system</div>
			<div class="card-body py-2">
				<Typeahead
					@update:modelValue="planets.push($event)"
					:minInputLength="0"
					:requestDelay="0"
					:items="planetItems">
				</Typeahead>
				<div class="mt-2" v-show="planets.length > 0">
					<span
						:class="{
							badge: true,
							'rounded-pill': true,
							'bg-dark': true,
							'ms-2': index > 0
						}"
						style="font-size:inherit"
						v-for="(planet, index) in planets" :key="index"
						>{{ planet }}<button type="button" class="btn-close btn-close-white p-0 ms-2" @click="planets.splice(index, 1)"></button>
					</span>
				</div>
			</div>
			<div class="card-footer border-0 opacity-75 bg-white">
				<BadgePill v-for="(text, index) in [ 'items function', 'minInputLength', 'requestDelay', '@update:modelValue' ]" :key="index" :text="text" />
			</div>
		</div>

		<div class="card mb-4 shadow-sm">
			<div class="card-header text-uppercase bg-white border-0 fw-bold">TV Shows<BadgePill text="REST" /></div>
			<div class="card-body py-2">
				<Typeahead
					placeholder="Search the TVmaze database..."
					:inputClass="{
						'form-control': true,
						'is-valid': show ? true : false
					}"
					v-model="show"
					:minInputLength="3"
					:items="shows"/>
			</div>
			<div class="card-footer border-0 opacity-75 bg-white">
				<BadgePill v-for="(text, index) in [ 'inputClass', 'items function', 'minInputLength', 'placeholder' ]" :key="index" :text="text" />
			</div>
		</div>

		<div class="card mb-4 shadow-sm">
			<div class="card-header text-uppercase bg-white border-0 fw-bold">World Countries<BadgePill text="REST" /></div>
			<div class="card-body py-2">
				<div class="d-flex position-relative align-items-center">
					<Typeahead
						v-model="country"
						:items="countries"
						:itemProjection="countryProjection"
						dropdownClass="dropdown flex-fill"
						@request:fired="spinner = true"
						@request:completed="spinner = false"
						@request:canceled="spinner = false">
						<template #item="slot">
							<div v-html="slot.boldMatchText(slot.itemProjection(slot.item))"></div>
						</template>
					</Typeahead>
					<div
						class="spinner-border spinner-border-sm text-dark position-absolute"
						v-show="spinner"
						:style="{
						right: '1rem'
					}"></div>
				</div>
				<div class="mt-2 mb-0 alert shadow-sm" v-if="country">
					<h5>{{ country.name.official }}</h5>
					Region: {{ country.region }}<br>
					Sub-region: {{ country.subregion }}<br>
					Capital city: <template v-for="(city, index) in country.capital" :key="index">
						<template v-if="index > 0">, </template>
						{{ city }}
					</template>
				</div>
			</div>
			<div class="card-footer border-0 opacity-75 bg-white">
				<BadgePill v-for="(text, index) in [
					'dropdownClass', 'items function', 'itemsProjection', 'slot', '@request:fired', '@request:completed', '@request:canceled'
				]" :key="index" :text="text" />
			</div>
		</div>
		
	</main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BadgePill from "./BadgePill.vue";

const states = [ "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming" ];
const state = ref(states[0]);

const color = ref(null);

const planets = ref([]);
const planetItems = () => {
	// exclude planets already loaded
	return Promise.resolve(['Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune'].filter(planet => !planets.value.includes(planet) ));
}

const show = ref(null);
const shows = (query) => {
	return fetch("https://api.tvmaze.com/search/shows?q=" + query).then(res => res.json()).then(res => res.map(entry => entry.show.name));
}

const country = ref(null);
const countries = (query) => {
	if (!query) return;
	return fetch("https://restcountries.com/v3.1/name/" + query).then(res => res.json()).catch(() => []);
}
const countryProjection = (country) => (country ? country.name.common : '');
const spinner = ref(false);

onMounted(() => {
	let link = document.createElement("link");
	link.setAttribute("rel", "stylesheet");
	link.setAttribute("href", "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css");
	document.getElementsByTagName("head")[0].appendChild(link);
});
</script>

<style>
.italy {
	background-color: #eee;
	width: 0.4rem;
	height: 0.85rem;
	display: inline-block;
	position: relative;
	margin: 0.1rem 0.5rem 0 0.5rem;
}
.italy:before, .italy:after {
	width: 0.4rem;
	content: '';
	display: inline-block;
	position: absolute;
	top: 0;
	bottom: 0;
}
.italy:before {
	background-color: #45914a;
	left: -0.4rem;
}
.italy:after {
	background-color: #b8323b;
	right: -0.4rem;
}
</style>