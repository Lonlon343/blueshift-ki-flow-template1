import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	resolve: {
		alias: {
			'lucide-svelte': '/src/lib/vendor/lucide-svelte'
		}
	},
	plugins: [tailwindcss(), sveltekit()]
});
