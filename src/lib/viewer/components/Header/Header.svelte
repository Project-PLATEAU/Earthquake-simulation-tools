<script lang="ts" module>
	export interface Props {
		title: string;
		className?: string;
	}
</script>

<script lang="ts">
	import { cn } from '$lib//viewer/utils/twUtil.js';
	import { toggleVisibility, leftData } from '$lib/viewer/store/CompareStore';

	let { title, className = '' }: Props = $props();

	const removeSuffix = (text: string) => {
		const regex = /(市|町|村)$/;
		return text.replace(regex, '');
	};
</script>

<header class={cn('flex items-center justify-between', className)}>
	<h1 class="p-3 text-start text-xl text-white">
		{removeSuffix(title)}
	</h1>
	{#if $leftData}
		<button class="rounded bg-blue-500 p-2 text-white" onclick={toggleVisibility}>
			グラフ表示
		</button>
	{/if}
	<div class="p-3 text-end text-lg font-semibold text-white">Powered By AIGID</div>
</header>
