<script lang="ts">
	import '../app.css';
	import Toaster from '$lib/components/ui/Toaster.svelte';
	import type { Snippet } from 'svelte';
	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<Toaster />

{@render children?.()}
