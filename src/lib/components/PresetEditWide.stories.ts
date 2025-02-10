import type { Meta, StoryObj } from '@storybook/svelte';
import Component, { type Props } from '$lib/components/PresetEditWide.svelte';

const meta: Meta<Props> = {
	title: 'PresetEdit',
	component: Component,
	tags: ['autodocs']
};

export default meta;
type Story = StoryObj<Props>;

export const Normal: Story = {
	args: {
		presetLabel: '建物名',
		presetName: 'buildingName'
	}
};
