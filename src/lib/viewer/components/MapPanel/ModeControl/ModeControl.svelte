<script lang="ts" module>
	import type { TerraDraw } from 'terra-draw';
	import TrashIcon from '$lib/viewer/components/icons/TrashIcon.svelte';
	import PolygonIcon from '$lib/viewer/components/icons/PolygonIcon.svelte';
	import CursorIcon from '$lib/viewer/components/icons/CursorIcon.svelte';
	import EraserIcon from '$lib/viewer/components/icons/EraserIcon.svelte';
	import { slide } from 'svelte/transition';

	export interface Props {
		mode: string;
		draw: TerraDraw | undefined;
		polygonIds: Array<string | number | undefined>;
	}
</script>

<script lang="ts">
	let { mode = $bindable(), draw, polygonIds = $bindable() }: Props = $props();
	let selectedId = $state<number | string>('');

	$effect(() => {
		const handler = (id: string | number) => {
			selectedId = id;
		};
		draw?.on('select', handler);
		return () => {
			draw?.off('select', handler);
		};
	});
</script>

<div class="absolute left-5 top-5 z-10 flex flex-col rounded shadow-md">
	<button
		onclick={() => {
			if (mode === 'polygon') {
				mode = 'render';
			} else {
				mode = 'polygon';
			}
		}}
		class={[
			'rounded-t p-2 hover:bg-gray-200',
			mode === 'polygon' ? 'bg-orange-300 hover:bg-orange-300' : 'bg-white'
		]}
	>
		<PolygonIcon class="h-4 w-4" />
	</button>
	<hr />
	<button
		onclick={() => {
			if (mode === 'select') {
				mode = 'render';
			} else {
				mode = 'select';
			}
		}}
		class={[
			'p-2 hover:bg-gray-200',
			mode === 'select' ? 'bg-orange-300 hover:bg-orange-300' : 'bg-white'
		]}
	>
		<CursorIcon class="h-4 w-4" />
	</button>
	<hr />
	{#if mode === 'select'}
		<button
			onclick={() => {
				if (selectedId === '') return;
				draw?.removeFeatures([selectedId]);
				draw?.deselectFeature(selectedId);
				polygonIds = polygonIds.filter((id) => id !== selectedId);
				selectedId = '';
			}}
			class="bg-white p-2 hover:bg-gray-200"
			transition:slide
		>
			<EraserIcon class="h-4 w-4" />
		</button>
	{/if}
	<hr />
	<button
		onclick={() => {
			draw?.clear();
			polygonIds = [];
		}}
		class="rounded-b bg-white p-2 hover:bg-gray-200"
	>
		<TrashIcon class="h-4 w-4 fill-red-500" />
	</button>
</div>
