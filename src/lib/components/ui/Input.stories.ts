import type { Meta, StoryObj } from '@storybook/svelte';
import Component, { type Props } from '$lib/components/ui/Input.svelte';

const meta: Meta<Props> = {
	title: 'UI/Input',
	component: Component,
	tags: ['autodocs']
};

export default meta;
type Story = StoryObj<Props>;

export const Text: Story = {
	args: {
		inputType: 'text',
		placeholder: "Enter text"
	}
};

export const Password: Story = {
	args: {
		inputType: 'password',
		placeholder: "Enter password"
	}
};

export const Email: Story = {
	args: {
		inputType: 'email',
		placeholder: "Enter e-mail"
	}
};
