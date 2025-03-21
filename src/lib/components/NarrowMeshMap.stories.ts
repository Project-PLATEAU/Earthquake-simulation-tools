import type { Meta, StoryObj } from '@storybook/svelte';
import Component, { type Props } from '$lib/components/NarrowMeshMap.svelte';

const meta: Meta<Props> = {
	title: 'NarrowMeshMap',
	component: Component,
	tags: ['autodocs']
};

export default meta;
type Story = StoryObj<Props>;

export const Normal: Story = {
	args: {
		isOpen: true,
		lng: 138.33323,
		lat: 34.95373,
		onClose: () => alert('close'),
		onSelect: () => alert('select')
	}
};
