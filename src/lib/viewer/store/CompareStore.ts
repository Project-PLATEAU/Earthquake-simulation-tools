import { writable } from 'svelte/store';

// ストアを作成
export const isVisible = writable<boolean>(false);

//左グラフデータ
export const leftData = writable<{ data: number[]; title: string } | null>(null);

//右グラフデータ
export const rightData = writable<{ data: number[]; title: string } | null>(null);

// 更新関数
export const toggleVisibility = () => {
	isVisible.update((current) => !current);
};

export const show = () => {
	isVisible.set(true);
};

export const hide = () => {
	isVisible.set(false);
};
