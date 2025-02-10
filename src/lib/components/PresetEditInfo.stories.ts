import type { Meta, StoryObj } from '@storybook/svelte';
import Component, { type Props } from '$lib/components/PresetEditInfo.svelte';

const meta: Meta<Props> = {
	title: 'PresetEditInfo',
	component: Component,
	tags: ['autodocs']
};

export default meta;
type Story = StoryObj<Props>;

export const Normal: Story = {
	args: {
		presetLabel: '建物名',
		presetName: 'buildingName',
		presetInfo: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
	}
};
