import { createApp } from 'vue'
import App from './App.vue'
import TypeAhead from "./TypeAhead.vue";

let app = createApp(App);
app.component('TypeAhead', TypeAhead);
app.mount('#app');
