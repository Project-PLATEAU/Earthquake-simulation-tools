<template>
  <div class="m-48 detail-view detail-simulation">
    <div class="text-center flex justify-center space-x-6 mt-4">
      <div class="border border-solid border-blue-500 h-64 w-[470px] p-5">
        <div class="font-bold text-left w-[90%] my-0 mx-auto">地域</div>
        <div class="mt-2">
          <div class="text-left font-bold w-[90%] my-0 ax-auto">名称:</div>
          <div class="text-left w-[90%] my-0 ax-auto">{{simulationReserveDetail!.region_presets_name}}</div>
        </div>
        <div class="mt-6">
          <div class="text-left font-bold w-[90%] my-0 ax-auto">付帯情報:</div>
          <div class="text-left w-[90%] my-0 ax-auto">{{simulationReserveDetail!.region_presets_additional_info}}</div>
        </div>
      </div>
      <div class="border border-solid border-blue-500 h-64 w-[470px] p-5">
        <div class="font-bold text-left w-[90%] my-0 mx-auto">地振動データ</div>
        <div class="mt-2">
          <div class="text-left font-bold w-[90%] my-0 ax-auto">名称:</div>
          <div class="text-left w-[90%] my-0 ax-auto">{{simulationReserveDetail!.earthquake_presets_name}}</div>
        </div>
        <div class="mt-6">
          <div class="text-left font-bold w-[90%] my-0 ax-auto">付帯情報:</div>
          <div class="text-left w-[90%] my-0 ax-auto">{{simulationReserveDetail!.earthquake_additional_info}}</div>
        </div>
      </div>
    </div>
    <div class="mt-20 text-center flex justify-center">
      <div class="text-left flex justify-center w-[470px]">
        <div class="basis-64">
          <label class="text-left font-bold w-[90%] my-0 ax-auto">ステータス:</label>
          <label class="text-left w-[90%] my-0 ax-auto">{{ simulationReserveDetail!.calc_status_name }}</label>
        </div>
        <div class="basis-64">
          <label class="text-left font-bold w-[90%] my-0 ax-auto">登録日時:</label>
          <label class="text-left w-[90%] my-0 ax-auto">{{ simulationReserveDetail!.create_date }}</label>
        </div>
      </div>
      <div class="text-center flex justify-end w-[470px] space-x-6">
        <button
          class="bg-blue-500 text-white text-xs h-8 leading-4 rounded-md px-4"
          :disabled="[2,4,5,6].includes(simulationReserveDetail!.calc_status_id)"
          @click="clickDownloadCalcResult">計算結果</button>
        <button
          class="bg-blue-500 text-white text-xs h-8 leading-4 rounded-md px-4"
          :disabled="simulationReserveDetail!.calc_status_id != 5"
          @click="clickDownloadVisualizationData">可視データ</button>
        <button
          class="bg-blue-500 text-white text-xs h-8 leading-4 rounded-md px-4"
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