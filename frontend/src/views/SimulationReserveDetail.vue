<template>
    <div class="m-10">
        <div class="flex space-x-4 mt-4">
          <div class="bg-slate-200 w-64 h-80">
            <div class="font-bold">地域</div>
            <div class="mt-6">
              <div class="pr-6 font-bold">名称:</div>
              <div class="w-2/5">{{simulationReserveDetail!.region_presets_name}}</div>
            </div>
            <div class="mt-6">
              <div class="pr-6 font-bold">付帯情報:</div>
              <div class="w-2/5 whitespace-pre">{{simulationReserveDetail!.region_presets_additional_info}}</div>
            </div>
          </div>
          <div class="bg-slate-200 w-64 h-80">
            <div class="font-bold">地振動データ</div>
            <div class="mt-6">
              <div class="pr-6 font-bold">名称:</div>
              <div class="w-2/5">{{simulationReserveDetail!.earthquake_presets_name}}</div>
            </div>
            <div class="mt-6">
              <div class="pr-6 font-bold">付帯情報:</div>
              <div class="w-2/5 whitespace-pre">{{simulationReserveDetail!.earthquake_additional_info}}</div>
            </div>
          </div>
        </div>
        <div class="mt-6">
          <div class="w-dvw flex flex-row">
            <div class="basis-64">
              <label class="text-sm">ステータス</label>
              <br/>
              <label>{{ simulationReserveDetail!.calc_status_name }}</label>
            </div>
            <div class="basis-64">
              <label class="text-sm">登録日時</label>
              <br/>
              <label>{{ simulationReserveDetail!.create_date }}</label>
            </div>
            <button 
              class="border bg-slate-200 basis-36 py-1 px-3 w-32 ml-6 hover:cursor-pointer"
              :disabled="[2,4,5,6].includes(simulationReserveDetail!.calc_status_id)"
              @click="clickDownloadCalcResult">計算結果</button>
            <button 
              class="border bg-slate-200 basis-36 py-1 px-3 w-32 ml-6 hover:cursor-pointer" 
              :disabled="simulationReserveDetail!.calc_status_id != 5"
              @click="clickDownloadVisualizationData">可視データ</button>
            <button 
              class="border bg-slate-200 basis-36 py-1 px-3 w-32 ml-6 hover:cursor-pointer" 
              :disabled="simulationReserveDetail!.calc_status_id != 5"
              @click="clickVisualizationPage">確認</button>
          </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { SimulationReserveApi } from "../apis/http/SimulationReserves";
import { SimulationReservePathParam, SimulationReserveGetResponse } from "../models/SimulationReserves"

const router = useRouter();
const props = defineProps<{
  id: string
}>();
const apiClient = new SimulationReserveApi();

const simulationReserveDetail = ref<SimulationReserveGetResponse>();

const getSimulationReserveDetail = async() => {
  const pathParam: SimulationReservePathParam = {
    id: props.id
  }
  const query = { user_id: 12 };
  const res = await apiClient.get(pathParam, query);
  simulationReserveDetail.value = res;
}
getSimulationReserveDetail();

const clickDownloadCalcResult = () => {
  // 計算結果
  router.push({name: "RegionPresetList"});
}

const clickDownloadVisualizationData = () => {
  // 可視データ
  router.push({name: "RegionPresetList"});
}

const clickVisualizationPage = () => {
  // 確認
  router.push({name: "RegionPresetList"});
}
</script>