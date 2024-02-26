
import { defineStore } from 'pinia';

export const useSimulationReserveStore = defineStore('SimulationReserve', {
  state: () => ({
    RegionPresetId: 0,
    RegionPresetName: '',
    EarthQuakePresetId: 0,
    EarthQuakePresetName: ''
  })
});