<script lang="ts" module>
	import TableHeader from '$lib/components/simulationTable/TableHeader.svelte';
	import TableRow from '../simulationTable/TableRow.svelte';

	const args = {
		regionName: '静岡県',
		presetName: '設計用入力地震動（広域計算用）',
		time: '2001/3/12',
		status: '計算開始',
		detailPath: 'https://google.com'
	};

	export { tableHeader, tableRows };
</script>

{#snippet tableHeader()}
	<TableHeader headerItems={['地域', '地震動データ', '登録日時', 'ステータス', '']} />
{/snippet}

{#snippet tableRows()}
	<TableRow {...args} />
	<TableRow {...args} />
	<TableRow {...args} />
	<TableRow {...args} />
	<TableRow {...args} />
{/snippet}
