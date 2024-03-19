<template>
    <div class="m-10 list-view">
        <div class="text-xl font-bold">地振動シミュレーション実行状況確認</div>
        <div class="mt-16 w-full">
          <table class="w-full table-fixed">
            <thead>
              <tr>
                <th class="text-left font-semibold text-base h-10 align-middle border-b-4 border-solid boreder-blue-200">地域</th>
                <th class="w-40 text-left font-semibold text-base h-10 align-middle border-b-4 border-solid boreder-blue-200">地振動データ</th>
                <th class="w-60 font-semibold text-base h-10 align-middle border-b-4 border-solid boreder-blue-200">登録日時</th>
                <th class="w-60 font-semibold text-base h-10 align-middle border-b-4 border-solid boreder-blue-200">ステータス</th>
                <th class="w-60 font-semibold text-base h-10 align-middle border-b-4 border-solid boreder-blue-200"></th>
              </tr>
            </thead>
            <tbody>
              <tr class="h-6" v-for="data in simulationReserves">
                <td class="text-left h-12 border-b border-solid boreder-blue-500">{{ data.region_presets_name }}</td>
                <td class="text-left h-12 border-b border-solid boreder-blue-500">{{ data.earthquake_presets_name }}</td>
                <td class="text-center h-12 border-b border-solid boreder-blue-500">{{ data.create_date }}</td>
                <td class="text-center h-12 border-b border-solid boreder-blue-500">{{ data.calc_status_name }}</td>
                <td class="text-center h-12 border-b border-solid boreder-blue-500">
                  <button class="bg-transparent text-blue-500 rounded-md border border-solid border-blue-500 text-xs px-4 h-10 hover:text-blue-400" @click="clickSimulationReserveDetail(data.id)">詳細</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 text-center flex justify-center">
          <button class="bg-blue-500 text-white text-xs h-8 leading-4 rounded-md px-4" @click="clickReturn">戻る</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { SimulationReserveApi } from "../apis/http/SimulationReserves";
// import { RegionPresetPathParam } from '../models/SimulationReserves';

const router = useRouter();
const apiClient = new SimulationReserveApi();
type simulationReservesTableRowType = {
  id: number;
  region_presets_name: string;
  earthquake_presets_name: string;
  create_date: string;
  calc_status_name: string;
}

const simulationReserves = ref<simulationReservesTableRowType[]>();

const getSimulationReserve = async() => {
  const params = {
    user_id: 12
  };
  const res = await apiClient.list(params);
  simulationReserves.value = res.simulation_reserves.map((simulation) => <simulationReservesTableRowType>{
    id: simulation.id,
    region_presets_name: simulation.region_presets_name,
    earthquake_presets_name: simulation.earthquake_presets_name,
    create_date: simulation.create_date,
    calc_status_name: simulation.calc_status_name
  });
}
getSimulationReserve();

const clickSimulationReserveDetail = (id: number)=>{
  router.push({name: "SimulationReserveDetail", params:{ id }});
}

const clickReturn = () => {
  // メニューに戻る
  router.push({name: "Menu"});
}

</script>
