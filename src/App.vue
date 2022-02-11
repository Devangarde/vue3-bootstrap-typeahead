<template>
	<div class="container py-4">
		<h1 class="">vue3-bootstrap-typeahead</h1>
		<div class="mb-4">Visit <a href="https://github.com/Devangarde/vue3-bootstrap-typeahead"><code>vue3-bootstrap-typeahead</code> on GitHub</a> for documentation</div>

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
				<span class="badge rounded-pill bg-primary me-2">items array</span>
				<span class="badge rounded-pill bg-primary me-2">maxItems</span>
			</div>
		</div>

		<div class="card mb-4 shadow-sm">
			<div class="card-header text-uppercase bg-white border-0 fw-bold">Colors</div>
			<div class="card-body py-2">
				<Typeahead
					v-model="color"
					:allowNew="true"
					:items="['Black','Blue','Brown','Cyan','Gray','Green','Lime','Magenta','Orange','Red','Yellow']"
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
				<span class="badge rounded-pill bg-primary me-2">allowNew</span>
				<span class="badge rounded-pill bg-primary me-2">items array</span>
				<span class="badge rounded-pill bg-primary me-2">dropdownItemClass</span>
				<span class="badge rounded-pill bg-success me-2">slot</span>
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
				<span class="badge rounded-pill bg-primary me-2">items function</span>
				<span class="badge rounded-pill bg-primary me-2">minInputLength</span>
				<span class="badge rounded-pill bg-primary me-2">requestDelay</span>
				<span class="badge rounded-pill bg-info me-2">@update:modelValue</span>
			</div>
		</div>

		<div class="card mb-4 shadow-sm">
			<div class="card-header text-uppercase bg-white border-0 fw-bold">TV Shows<span class="badge rounded-pill bg-danger ms-2">REST</span></div>
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
				<span class="badge rounded-pill bg-primary me-2">inputClass</span>
				<span class="badge rounded-pill bg-primary me-2">items function</span>
				<span class="badge rounded-pill bg-primary me-2">minInputLength</span>
				<span class="badge rounded-pill bg-primary me-2">placeholder</span>
			</div>
		</div>

		<div class="card mb-4 shadow-sm">
			<div class="card-header text-uppercase bg-white border-0 fw-bold">World Countries<span class="badge rounded-pill bg-danger ms-2">REST</span></div>
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
				<span class="badge rounded-pill bg-primary me-2">dropdownClass</span>
				<span class="badge rounded-pill bg-primary me-2">items function</span>
				<span class="badge rounded-pill bg-primary me-2">itemsProjection</span>
				<span class="badge rounded-pill bg-success me-2">slot</span>
				<span class="badge rounded-pill bg-info me-2">@request:fired</span>
				<span class="badge rounded-pill bg-info me-2">@request:completed</span>
				<span class="badge rounded-pill bg-info me-2">@request:canceled</span>
			</div>
		</div>
		
	</div>
</template>

<script>
export default {
	name: 'App',
	data() {
		return {
			state: null,
			states: [ "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming" ],
			color: null,
			planets: [],
			show: null,
			country: null,
			spinner: false
		}
	},
	methods: {
		planetItems() {
			const app = this;
			// exclude planets already loaded
			return Promise.resolve(['Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune'].filter(planet => {
				return !app.planets.includes(planet)
			}));
		},
		shows(query) {
			return fetch("https://api.tvmaze.com/search/shows?q=" + query).then(res => {
				return res.json()
			}).then(res => {
				return res.map(entry => {
					return entry.show.name
				});
			});
		},
		countries(query) {
			if (!query) return;
			return fetch("https://restcountries.com/v3.1/name/" + query).then(res => {
				return res.json();
			}).catch(() => {
				return [];
			});
		},
		countryProjection(country) {
			return (country ? country.name.common : '');
		}
	},
	created() {
		let link = document.createElement("link");
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("href", "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css");
		link.setAttribute("integrity", "sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3");
		link.setAttribute("crossorigin", "anonymous");
		document.getElementsByTagName("head")[0].appendChild(link);
	}
}
</script>