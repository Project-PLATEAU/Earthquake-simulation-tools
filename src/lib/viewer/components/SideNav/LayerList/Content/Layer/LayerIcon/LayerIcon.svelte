<script lang="ts" module>
	import type { Data, LayerConfig } from '$lib/types/loadedData';

	export interface Props {
		data: Data;
		layers: LayerConfig[];
		className?: string;
	}
</script>

<script lang="ts">
	import { cn } from '$lib/viewer/utils/twUtil';

	let { data, layers, className = '' }: Props = $props();
	const layerConfig = layers.find((layer) => layer.id === data.id[0]);
	const imageIconTypes = ['geojsonicon', 'geojsonfcicon'];
</script>

{#if !layerConfig}
	<div class={cn('h-4 w-4', className)}></div>
{:else if imageIconTypes.includes(layerConfig.type) && layerConfig.icon}
	<div class={cn('h-4 max-h-4 min-h-4 w-4 min-w-4 max-w-4 overflow-hidden', className)}>
		<img
			src={layerConfig.icon.url}
			width="26px"
			height="26px"
			class="h-6 w-6 object-cover object-center"
			alt={data.title}
		/>
	</div>
{:else if !data.color}
	<div class={cn('h-4 w-4', className)}></div>
{:else if data.type === 'raster'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox={'0 0 32 32'}
		class={cn('h-4 w-4', className)}
		style={`color: ${data.color}`}
	>
		<path
			d="m25.609103,25.876536l0,0.937318c0,1.553019 -1.034146,2.811955 -2.309866,2.811955l-18.478925,0c-1.27572,0 -2.309866,-1.258935 -2.309866,-2.811955l0,-14.997091c0,-1.553019 1.034146,-2.811955 2.309866,-2.811955l0.769955,0l0,2.811955l-0.481222,0a0.288733,0.351494 0 0 0 -0.288733,0.351494l0,14.294102a0.288733,0.351494 0 0 0 0.288733,0.351494l17.901459,0a0.288733,0.351494 0 0 0 0.288733,-0.351494l0,-0.585824l2.309866,0zm2.021132,-19.683682l-17.901459,0a0.288733,0.351494 0 0 0 -0.288733,0.351494l0,14.294102a0.288733,0.351494 0 0 0 0.288733,0.351494l17.901459,0a0.288733,0.351494 0 0 0 0.288733,-0.351494l0,-14.294102a0.288733,0.351494 0 0 0 -0.288733,-0.351494zm0.288733,-2.811955c1.27572,0 2.309866,1.258935 2.309866,2.811955l0,14.997091c0,1.553019 -1.034146,2.811955 -2.309866,2.811955l-18.478925,0c-1.27572,0 -2.309866,-1.258935 -2.309866,-2.811955l0,-14.997091c0,-1.553019 1.034146,-2.811955 2.309866,-2.811955l18.478925,0zm-12.704261,6.561227c0,1.294144 -0.86182,2.343295 -1.924888,2.343295s-1.924888,-1.049152 -1.924888,-2.343295s0.86182,-2.343295 1.924888,-2.343295s1.924888,1.049152 1.924888,2.343295zm1.154933,5.623909l4.98137,-6.064156c0.225501,-0.274517 0.591133,-0.274517 0.816682,0l3.441411,4.189519l0,4.686591l-13.859194,0l0,-2.811955l4.619731,0z"
			fill="currentColor"
		/>
	</svg>
{:else if data.type === 'icon'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox={'0 0 32 32'}
		class={cn('h-4 w-4', className)}
		style={`color: ${data.color}`}
	>
		<path d="M50 150L6.69873 75L93.3013 75L50 150Z" fill={'currentColor'} />
		<circle cx="50" cy="50" r="50" fill={'currentColor'} />
		<path
			d="M45.496 71.6829C39.7859 70.4387 34.7894 66.9367 31.5971 61.9412C28.4048 56.9457 27.276 50.8626 28.4572 45.0196C29.6384 39.1767 33.0336 34.0486 37.9016 30.7547C42.7696 27.4608 48.7151 26.2687 54.4402 27.4386C60.1653 28.6085 65.205 32.0454 68.4591 36.999C71.7133 41.9526 72.9176 48.0206 71.8092 53.8784C70.7008 59.7362 67.3696 64.908 62.543 68.2648C57.7163 71.6217 51.7861 72.8909 46.0469 71.7954"
			fill="white"
		/>
	</svg>
{:else if data.type === 'point'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox={'0 0 32 32'}
		class={cn('h-4 w-4', className)}
		style={`color: ${data.color}`}
	>
		<path
			d="M22 16C22 19.31 19.31 22 16 22C12.69 22 10 19.31 10 16C10 12.69 12.69 10 16 10C19.31 10 22 12.69 22 16Z"
			fill="currentColor"
		/>
	</svg>
{:else if data.type === 'line' || data.type === 'personflow'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox={'0 0 32 32'}
		class={cn('h-4 w-4', className)}
		style={`color: ${data.color}`}
	>
		<line
			id="svg_line"
			y2="5"
			x2="26"
			y1="26"
			x1="5"
			stroke-width="1.5"
			stroke="currentColor"
			fill="none"
		/>
	</svg>
{:else if data.type === 'polygon'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox={'0 0 32 32'}
		class={cn('h-4 w-4', className)}
		style={`color: ${data.color}`}
	>
		<path
			d="m5.926816,16.972813l4.436182,-8.716707l11.829817,0l4.43618,8.716707l-4.43618,8.716707l-11.829817,0l-4.436182,-8.716707z"
			stroke-width="1.5"
			fill="currentColor"
		/>
	</svg>
{:else if data.type === 'building'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox={'0 0 32 32'}
		class={cn('h-4 w-4', className)}
		style={`color: ${data.color}`}
	>
		<path
			d="M6 12C6 14.71 6 20.12 6 28.24"
			fill="none"
			stroke="currentColor"
			stroke-width="1"
		/>
		<path
			d="M16 6.14C16 6.14 16 6.14 16 6.14L16 28"
			fill="none"
			stroke="currentColor"
			stroke-width="1"
		/>
		<path d="M26 28C26 24.67 26 18 26 8" fill="none" stroke="currentColor" stroke-width="1" />
		<path
			d="M16 6.72C16 6.72 16 6.72 16 6.72L6 12.35"
			fill="none"
			stroke="currentColor"
			stroke-width="1"
		/>
		<path d="M26 28C22.67 28 16 28 6 28" fill="none" stroke="currentColor" stroke-width="1" />
		<path d="M26 8C24.33 7.67 21 7 16 6" fill="none" stroke="currentColor" stroke-width="1" />
	</svg>
{:else if data.type === 'transaction'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox={'0 0 32 32'}
		class={cn('h-4 w-4', className)}
		style={`color: ${data.color}`}
	>
		<path
			d="M24 12C13.65 1.7 8.99 5.7 10 24"
			fill="#ffffff"
			stroke-width="2"
			stroke="currentColor"
		/>
		<path
			d="M16 24.42C16 25.76 13.43 26.85 10.25 26.85C7.08 26.85 4.51 25.76 4.51 24.42C4.51 23.09 7.08 22 10.25 22C13.43 22 16 23.09 16 24.42Z"
			fill="currentColor"
		/>
		<path
			d="M29.75 13.58C29.75 14.91 27.17 16 24 16C20.83 16 18.25 14.91 18.25 13.58C18.25 12.24 20.83 11.15 24 11.15C27.17 11.15 29.75 12.24 29.75 13.58Z"
			fill="currentColor"
		/>
		<path d="M24 12C13.65 1.7 8.99 5.7 10 24" fill="currentColor" />
	</svg>
{:else if data.type === 'pointcloud'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox={'0 0 32 32'}
		class={cn('h-4 w-4', className)}
		style={`color: ${data.color}`}
	>
		<path
			d="M21.5 18C21.5 18.83 20.83 19.5 20 19.5C19.17 19.5 18.5 18.83 18.5 18C18.5 17.17 19.17 16.5 20 16.5C20.83 16.5 21.5 17.17 21.5 18Z"
			fill="currentColor"
		/>
		<path
			d="M22.26 9.66C22.72 8.97 23.66 8.79 24.34 9.26C25.03 9.72 25.21 10.66 24.74 11.34C24.28 12.03 23.34 12.21 22.66 11.74C21.97 11.28 21.79 10.34 22.26 9.66Z"
			fill="currentColor"
		/>
		<path
			d="M15.5 13.15C15.5 13.98 14.83 14.65 14 14.65C13.17 14.65 12.5 13.98 12.5 13.15C12.5 12.32 13.17 11.65 14 11.65C14.83 11.65 15.5 12.32 15.5 13.15Z"
			fill="currentColor"
		/>
		<path
			d="M15 22C15 22.83 14.33 23.5 13.5 23.5C12.67 23.5 12 22.83 12 22C12 21.17 12.67 20.5 13.5 20.5C14.33 20.5 15 21.17 15 22Z"
			fill="currentColor"
		/>
		<path
			d="M26 26C26 26.83 25.33 27.5 24.5 27.5C23.67 27.5 23 26.83 23 26C23 25.17 23.67 24.5 24.5 24.5C25.33 24.5 26 25.17 26 26Z"
			fill="currentColor"
		/>
		<path
			d="M13.5 6C13.5 6.83 12.83 7.5 12 7.5C11.17 7.5 10.5 6.83 10.5 6C10.5 5.17 11.17 4.5 12 4.5C12.83 4.5 13.5 5.17 13.5 6Z"
			fill="currentColor"
		/>
		<path
			d="M8.5 26C8.5 26.83 7.83 27.5 7 27.5C6.17 27.5 5.5 26.83 5.5 26C5.5 25.17 6.17 24.5 7 24.5C7.83 24.5 8.5 25.17 8.5 26Z"
			fill="currentColor"
		/>
		<path
			d="M7.25 18C7.25 18.83 6.58 19.5 5.75 19.5C4.92 19.5 4.25 18.83 4.25 18C4.25 17.17 4.92 16.5 5.75 16.5C6.58 16.5 7.25 17.17 7.25 18Z"
			fill="currentColor"
		/>
	</svg>
{:else}
	<div class={cn('h-4 w-4', className)}></div>
{/if}
