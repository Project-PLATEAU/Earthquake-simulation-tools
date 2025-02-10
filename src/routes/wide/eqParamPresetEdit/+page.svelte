<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import { invalidate } from '$app/navigation';
	import Overlay from '$lib/components/Overlay.svelte';

	let isOverlay = $state(false);
	let eqParamName = $state('');

	let filename = $state('');
	const changeFile = (name: string) => {
		filename = name;
	};

	const updateEqParam = async () => {
		// 空白の場合は処理しない
		const trimmedName = eqParamName.trim();
		if (!trimmedName) {
			return;
		}

		isOverlay = true;
		const formData = new FormData();
		formData.append('eqParamName', eqParamName);

		const encodedActionName = encodeURIComponent('/updateEqParam');
		const response = await fetch(`?${encodedActionName}`, {
			method: 'POST',
			body: formData
		});

		try {
			const result = await response.json();
			if (result.type != 'success') {
				throw new Error(result.error || 'Unknown error occurred');
			} else {
				// リストに戻る
				await goto('eqParamPresetList');
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error('Error processing response:', error.message);
			} else {
				console.error('Error processing response:', error);
			}
		}

		// 必要に応じてページのデータを再取得
		await invalidate('/current-page-url');
		isOverlay = false;
	};

	const handlePath = async (path: string) => {
		isOverlay = true;
		await goto(path);
	};
</script>

<Overlay {isOverlay} />
<h1 class="p-10 text-2xl font-semibold">地震動データの登録</h1>
<div class="pt-6">
	<div class="ml-10">
		<div class="mt-10 flex flex-row">
			<label
				for="earthquake-name"
				class="inline-block w-48 basis-1/4 text-left text-base font-bold"
			>
				地震動識別名
			</label>
			<input
				type="text"
				name="earthquake-name"
				maxlength="255"
				bind:value={eqParamName}
				class="ml-5 inline-block h-10 w-[600px] rounded-md border border-solid border-primary pl-2 text-left"
			/>
		</div>
		<div class="mt-10 flex flex-row">
			<span class="inline-block w-48 basis-1/4 text-left text-base font-bold">
				地震動ファイルの選択
			</span>
			<FileUpload {filename} onchange={changeFile} />
		</div>
		<div class="mt-6 flex justify-center space-x-6 text-center">
			<Button onclick={() => handlePath('eqParamPresetList')}>戻る</Button>
			<Button onclick={updateEqParam}>登録</Button>
		</div>
	</div>
</div>
