import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import packageJson from './package.json'

export default defineConfig({
	base: '/vue3-bootstrap-typeahead/',
	plugins: [vue()],
	define: {
		'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version)
	},
	server: {
		host: '0.0.0.0',
	},
	build: {
		outDir: './demo'
	}
})
