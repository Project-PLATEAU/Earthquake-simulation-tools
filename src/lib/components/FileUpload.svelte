<script lang="ts" module>
	export interface Props {
		filename: string;
		onchange: (filename: string) => void;
	}
</script>

<script lang="ts">
	let { filename, onchange }: Props = $props();

	const handleFileChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		const files = input.files;
		if (files && files.length > 0) {
			filename = files[0].name;
			onchange(filename);
		}
	};
</script>

<div class="flex">
	<label
		class="ml-5 flex cursor-pointer items-center justify-center rounded-md border border-solid border-primary bg-transparent px-4 text-base text-primary hover:text-primary-hover"
	>
		<input type="file" onchange={handleFileChange} accept=".csv" class="hidden" />
		ファイルを選択
	</label>
	<input
		type="text"
		readonly
		class="ml-2 w-[440px] rounded-md border border-solid border-primary bg-transparent px-[17px] py-[6px] text-base text-primary"
		placeholder="選択されていません"
		value={filename}
	/>
</div>
