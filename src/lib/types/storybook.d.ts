import type { Component, SvelteComponent } from 'svelte';
import type { Args, ComponentAnnotations } from 'storybook/internal/types';

declare module '@storybook/svelte' {
	export type Meta<CmpOrArgs = Args> =
		CmpOrArgs extends SvelteComponent<infer Props>
			? ComponentAnnotations<SvelteRenderer<CmpOrArgs>, Props>
			: CmpOrArgs extends Component<infer Props>
				? ComponentAnnotations<SvelteRenderer, Props>
				: ComponentAnnotations<SvelteRenderer, CmpOrArgs>;
}
