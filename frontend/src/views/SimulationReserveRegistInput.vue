<template>
    <div class="m-10">
        <div class="mt-10">
          <label class="pr-6 w-32 inline-block">地域</label>
          <select class="w-2/5 ml-20" v-model="regionPresetSelected">
            <option v-for="preset in regionPresets" :value="preset">
              {{ preset.name }}
            </option>
          </select>
        </div>
        <div class="mt-10">
          <label class="pr-6 w-32 inline-block">地振動データ</label>
          <select class="w-2/5 ml-20" v-model="earthQuakePresetSelected">
            <option v-for="preset in earthQuakePresets" :value="preset">
              {{ preset.name }}
            </option>
          </select>
        </div>
        <div class="mt-20">
          <div class="text-center">
            <button class="border bg-slate-200 py-1 px-6 w-56" @click="clickSimulationExecute">シミュレーション実行</button>
          </div>
        </div>
        <div class="mt-6">
          <div class="w-72 grid grid-cols-2 gap-2">
            <button class="border bg-slate-200 py-1 px-6 w-32" @click="clickReturn">戻る</button>
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