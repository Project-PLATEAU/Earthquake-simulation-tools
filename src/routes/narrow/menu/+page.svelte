<script lang="ts">
	import { goto } from '$app/navigation';
	import Overlay from '$lib/components/Overlay.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let isOverlay = $state(false);

	const handlePath = async (path: string) => {
		isOverlay = true;
		await goto(path);
	};
</script>

<Overlay {isOverlay} />
<h1 class="p-10 text-2xl font-semibold">個別建物シミュレーション&nbsp;機能選択メニュー</h1>
<div class="flex flex-col items-center gap-10">
	<div class="flex w-96 flex-col items-center gap-2">
		<h2 class="mb-6 text-lg font-semibold">プリセット管理</h2>
		<Button onclick={() => handlePath('buildingPresetList')} className="w-full">
			建物データプリセット
		</Button>
		<Button onclick={() => handlePath('simModelPresetList')} className="w-full">
			解析モデルプリセット
		</Button>
	</div>
	<div class="flex w-96 flex-col items-center gap-2">
		<h2 class="mb-6 text-lg font-semibold">シミュレーション</h2>
		<Button onclick={() => handlePath('simulationReserved')} className="w-full">
			シミュレーション予約登録
		</Button>
		<Button onclick={() => handlePath('simulationReservedList')} className="w-full">
			シミュレーション管理
		</Button>
	</div>
	<Button onclick={() => handlePath('/menu')} className="w-96">メニューに戻る</Button>
</div>
