<script lang="ts" module>
	export interface Props {
		tooltipData?: {
			tooltipType: 'default' | 'thumbnail' | 'table';
			id: string;
			data: any;
		};
		tooltipPosition?: {
			top: string;
			left: string;
		};
	}
</script>

<script lang="ts">
	let { tooltipData, tooltipPosition }: Props = $props();

	const handleCloseClick = () => {
		tooltipData = undefined;
		tooltipPosition = undefined;
	};
	//TODO: Need to implement this component
</script>

{#if tooltipPosition && tooltipData}
	<div
		style="top: {tooltipPosition.top}; left: {tooltipPosition.left}"
		class="absolute z-50 rounded bg-white p-2 shadow-md"
	>
		<button onclick={handleCloseClick}>close</button>
		{#if tooltipData.tooltipType === 'default'}
			<div>{JSON.stringify(tooltipData.data)}</div>
		{:else if tooltipData.tooltipType === 'thumbnail'}
			<div>{JSON.stringify(tooltipData.data)}</div>
		{:else if tooltipData.tooltipType === 'table'}
			<table>
				<tbody>
					{#each Object.entries(tooltipData.data) as [key, value]}
						<tr>
							<td>{key}</td>
							<td>{value}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
{/if}
