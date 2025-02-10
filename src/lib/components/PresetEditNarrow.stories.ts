import type { Meta, StoryObj } from '@storybook/svelte';
import Component, { type Props } from '$lib/components/PresetEditNarrow.svelte';

const meta: Meta<Props> = {
	title: 'PresetEditNarrow',
	component: Component,
	tags: ['autodocs']
};

export default meta;
type Story = StoryObj<Props>;

export const Normal: Story = {
	args: {
		presetLabel: "建物名",
        presetName: "xxxxxxxxxx",
	}
};
