import type { Meta, StoryObj } from '@storybook/svelte';
import Component, { type Props } from '$lib/components/ConfirmDialog.svelte';

const meta: Meta<Props> = {
	title: 'ConfirmDialog',
	component: Component,
	tags: ['autodocs']
};

export default meta;
type Story = StoryObj<Props>;

export const Normal: Story = {
	args: {
		open: true,
		onClose: () => alert('Dialog closed')
	}
};
