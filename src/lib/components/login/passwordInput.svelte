<script lang="ts" module>
	export interface Props {
		value?: string;
		placeholder?: string | undefined;
		onfocus?: () => void;
	}
</script>

<script lang="ts">
	import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { createToggle, melt } from '@melt-ui/svelte';
	import Input from '$lib/components/ui/Input.svelte';

	let { value = $bindable(''), placeholder = undefined, onfocus }: Props = $props();

	const {
		elements: { root: root1 },
		states: { pressed: pressed1 }
	} = createToggle();
</script>

<div class="relative">
	{#if !$pressed1}
		<Input bind:value inputType="password" {placeholder} {onfocus} />
	{:else}
		<Input bind:value {placeholder} {onfocus} />
	{/if}
	<div use:melt={$root1} class="absolute inset-y-0 right-0 my-auto h-fit">
		{#if $pressed1}
			<FontAwesomeIcon icon={faEye} class="px-4 text-gray-500" />
		{:else}
			<FontAwesomeIcon icon={faEyeSlash} class="px-4 text-gray-500" />
		{/if}
	</div>
</div>
