import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	plugins: [vue()],
	build: {
		lib: {
			entry: 'src/typeahead.js',
			name: 'Vue3 Bootstrap TypeAhead',
			fileName: 'vue3-bootstrap-typeahead'
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue'
				}
			}
		}
	}
})
