import type { PageLoad } from './$types';
import { base } from '$app/paths';
import type { Backgrounds, Config, InitialView, Menu, Settings } from '$lib/types/loadedData';

export const load: PageLoad = async ({ fetch, url }) => {
	let preferencesPath = url.searchParams.get('preferences');
	if (preferencesPath === null) {
		preferencesPath = `${base ? base : ''}/defaultPreferences`;
	}
	const fetchJson = async (url: string) => await (await fetch(url)).json();

	const results = await Promise.all([
		fetchJson(`${preferencesPath}/settings.json`),
		fetchJson(`${preferencesPath}/menu.json`),
		fetchJson(`${preferencesPath}/config.json`),
		fetchJson(`${preferencesPath}/backgrounds.json`),
		fetchJson(`${preferencesPath}/initial_view.json`)
	]);
	return {
		settings: results[0] as Settings,
		menu: results[1] as Menu,
		config: results[2] as Config,
		backgrounds: results[3] as Backgrounds,
		initialView: results[4] as InitialView
	};
};
