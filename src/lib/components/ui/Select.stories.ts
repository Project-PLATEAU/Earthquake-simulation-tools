import type { Meta, StoryObj } from '@storybook/svelte';
import Component, { type Props } from '$lib/components/ui/Select.svelte';

const meta: Meta<Props> = {
	title: 'UI/Select',
	component: Component,
	tags: ['autodocs']
};

export default meta;
type Story = StoryObj<Props>;

export const Normal: Story = {
	args: {
		options: ['Option 1', 'Option 2', 'Option 3'],
		selectedValue: 'Option 2'
	}
};
