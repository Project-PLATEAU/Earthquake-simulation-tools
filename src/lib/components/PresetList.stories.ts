import type { Meta, StoryObj } from '@storybook/svelte';
import Component, { type Props } from '$lib/components/PresetList.svelte';

const meta: Meta<Props> = {
	title: 'PresetList',
	component: Component,
	tags: ['autodocs']
};

export default meta;
type Story = StoryObj<Props>;

export const Normal: Story = {
	args: {
		headerItems: ['選択', '地震動', '最終更新日'],
		selectedItemsDisplayNo: 0,
		presetInfos: [{ regionName: '静岡市', UpdatedAt: '2021/10/13' }]
	}
};
