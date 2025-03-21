import type { Meta, StoryObj } from '@storybook/svelte';
import Component, { type Props } from '$lib/components/WideMeshMap.svelte';

const meta: Meta<Props> = {
	title: 'WideMeshMap',
	component: Component,
	tags: ['autodocs']
};

export default meta;
type Story = StoryObj<Props>

export const Normal: Story = {
	args: {
		selectedCodes: [],
		isOpen: true
	}
};
