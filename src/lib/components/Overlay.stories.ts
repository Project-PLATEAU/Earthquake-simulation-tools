import type { Meta, StoryObj } from '@storybook/svelte';
import Component, { type Props } from '$lib/components/Overlay.svelte';

const meta: Meta<Props> = {
	title: 'Overlay',
	component: Component,
	tags: ['autodocs']
};

export default meta;
type Story = StoryObj<Props>;

export const Normal: Story = {
	args: {
		isOverlay: true
	}
};
