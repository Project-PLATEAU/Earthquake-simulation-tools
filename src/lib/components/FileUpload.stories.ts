import type { Meta, StoryObj } from '@storybook/svelte';
import Component, { type Props } from '$lib/components/FileUpload.svelte';

const meta: Meta<Props> = {
	title: 'FileUpload',
	component: Component,
	tags: ['autodocs']
};

export default meta;
type Story = StoryObj<Props>;

export const Normal: Story = {
	args: {
		filename: 'file.txt',
		onchange: (fileName: string) => alert('File uploaded')
	}
};
