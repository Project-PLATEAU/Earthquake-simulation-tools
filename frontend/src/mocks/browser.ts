import { setupWorker } from 'msw/browser';
import { RegionPresetsHandlers } from './RegionPresetsHandlers'
import { EarthQuakePresetsHandlers } from './EarthQuakePresetsHandlers'

export const worker = setupWorker(
  ...RegionPresetsHandlers, 
  ...EarthQuakePresetsHandlers
)