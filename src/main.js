import { createApp } from 'vue'
import App from '@/App.vue'
import Typeahead from "@/Typeahead.vue";

let app = createApp(App);
app.component('Typeahead', Typeahead);
app.mount('#app');
