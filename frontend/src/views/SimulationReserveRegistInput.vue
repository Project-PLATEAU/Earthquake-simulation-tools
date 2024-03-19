<template>
    <div class="m-48 regist-view regist-simulation">
      <div class="text-center">
        <div class="mt-10 text-left">
          <label for="region-select" class="block font-bold">地域</label>
          <select id="region-select" class="block text-left w-full h-10 rounded-md border border-solid border-blue-500" v-model="regionPresetSelected">
            <option v-for="preset in regionPresets" :value="preset">
              {{ preset.name }}
            </option>
          </select>
        </div>
        <div class="mt-10 text-left">
          <label class="block font-bold">地振動データ</label>
          <select class="block text-left w-full h-10 rounded-md border border-solid border-blue-500" v-model="earthQuakePresetSelected">
            <option v-for="preset in earthQuakePresets" :value="preset">
              {{ preset.name }}
            </option>
          </select>
        </div>
        <div class="mt-20 text-center flex justify-center space-x-6">
          <button class="bg-blue-500 text-white text-xs h-8 leading-4 rounded-md px-4" @click="clickReturn">戻る</button>
          <button class="bg-blue-500 text-white text-xs h-8 leading-4 rounded-md px-4" @click="clickSimulationExecute">シミュレーション実行</button>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { RegionPresetApi } from "../apis/http/RegionPresets";
import { RegionPresetGetResponse } from "../models/RegionPresets";
import { EarthQuakePresetApi } from "../apis/http/EarthQuakePresets";
import { EarthQuakePresetGetResponse } from "../models/EarthQuakePresets";
import { useSimulationReserveStore } from "../store/SimulationReserve";

const router = useRouter();
const earthQuakePresetApiClient = new EarthQuakePresetApi();
const regionPresetApiClient = new RegionPresetApi();
const earthQuakePresets = ref<EarthQuakePresetGetResponse[]>();
const regionPresets = ref<RegionPresetGetResponse[]>();
const earthQuakePresetSelected = ref<EarthQuakePresetGetResponse>();
const regionPresetSelected = ref<RegionPresetGetResponse>();
const simulationReserveStore = useSimulationReserveStore();

const getEarthQuakePreset = async() => {
  const res = await earthQuakePresetApiClient.list();
  earthQuakePresets.value = res.earthquake_presets || [];
}
getEarthQuakePreset();

const getRegionPreset = async() => {
  const res = await regionPresetApiClient.list();
  regionPresets.value = res.region_presets || [];
}
getRegionPreset();

const clickSimulationExecute = async ()=>{
  try {
    // 確認画面へ
    simulationReserveStore.$state = {
      EarthQuakePresetId: earthQuakePresetSelected.value!.id!,
      EarthQuakePresetName: earthQuakePresetSelected.value!.name!,
      RegionPresetId: regionPresetSelected.value!.id,
      RegionPresetName: regionPresetSelected.value!.name
    }
    router.push({name: "SimulationReserveRegistConfirm"});
  } catch (e){
    // TODO: エラー共通化
    console.log(e);
  }
}

const clickReturn = () => {
  router.push({name: "Menu"});
}
</script>