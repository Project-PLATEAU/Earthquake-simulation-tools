<script lang="ts">
	let { show = $bindable() } = $props();
</script>

{#if show}
	<div
		class="fixed left-0 top-0 z-[99999] flex h-screen w-screen items-center justify-center bg-black bg-opacity-50"
	>
		<div class="rounded-lg bg-white p-8 text-center shadow-xl">
			<div
				class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
			></div>
			<p class="text-lg font-semibold text-gray-700">集計中...</p>
		</div>
	</div>
{/if}

<style>
	/* viewport heightの100%を確実に確保 */
	:global(body) {
		height: 100vh;
		overflow: hidden;
	}
</style>
