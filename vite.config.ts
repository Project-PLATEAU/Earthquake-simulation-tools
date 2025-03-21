import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		// testの対象ファイル
		include: ['src/**/*.{test,spec}.{js,ts}'],
		exclude: ['**/contrib/**/*'],
		globals: true,
		// testの環境
		environment: 'jsdom',
		coverage: {
			enabled: true,
			exclude: [
				...coverageConfigDefaults.exclude,
				'**/contrib/**/*',
				'**/routes/**/*.svelte'
			],
			reporter: ['text', 'json', 'html']
		}
	}
});
