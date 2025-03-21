import { writable, type Writable } from 'svelte/store';
import type { Map } from 'maplibre-gl';
import { getContext, setContext } from 'svelte';
type Context = Writable<Map>;

export const initializeMapContext = () => {
	const map = writable<Map | undefined>(undefined);
	setContext('map', map);
	return map;
};

export const getMap = () => {
	return getContext<Context>('map');
};
