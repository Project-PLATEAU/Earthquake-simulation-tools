import { writable, type Writable } from 'svelte/store';
import type { Map } from 'maplibre-gl';
import { getContext, setContext } from 'svelte';
import type { MapboxOverlay } from '@deck.gl/mapbox';
type Context = Writable<Map>;

export const initializeDeckContext = () => {
	const deck = writable<MapboxOverlay | undefined>(undefined);
	setContext('deck', deck);
	return deck;
};

export const getDeck = () => getContext<Context>('deck');
