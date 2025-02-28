import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html';
import { readFileSync } from 'fs';
import vue from '@vitejs/plugin-vue'
import packageJson from './package.json'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
	base: '/vue3-bootstrap-typeahead/',
	plugins: [
		vue(),
		createHtmlPlugin({
			inject: {
				data: {
					version: pkg.version,
				},
			},
		}),
	],
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
