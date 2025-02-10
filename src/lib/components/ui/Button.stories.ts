import type { Meta, StoryObj } from '@storybook/svelte';
import Component, { type Props } from '$lib/components/ui/Button.svelte';
import { text } from '$lib/components/storySnippet/Button.svelte';

const meta: Meta<Props> = {
	title: 'UI/Button',
	component: Component,
	tags: ['autodocs']
};

export default meta;
type Story = StoryObj<Props>;

export const Primary: Story = {
	args: {
		variant: 'primary',
		children: text,
		onclick: () => alert('Button clicked')
	}
};

export const Secondary: Story = {
	args: {
		variant: 'secondary',
		children: text,
		onclick: () => alert('Button clicked')
	}
};

export const Outline: Story = {
	args: {
		variant: 'outline',
		children: text,
		onclick: () => alert('Button clicked')
	}
};
