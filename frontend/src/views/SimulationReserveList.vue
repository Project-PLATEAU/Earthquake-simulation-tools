<template>
    <div class="m-10">
        <div class="text-xl">地振動シミュレーション実行状況確認</div>
        <div class="mt-4 w-full h-80">
          <table class="border-slate-500 w-full table-fixed">
            <thead>
              <tr>
                <th class="border-b-2">CityGML</th>
                <th class="border-b-2 w-40">地振動データ</th>
                <th class="border-b-2 w-60">登録日時</th>
                <th class="border-b-2 w-60">ステータス</th>
                <th class="border-b-2 w-60"></th>
              </tr>
            </thead>
            <tbody>
              <tr class="h-6" v-for="data in simulationReserves">
                <td class="border-b">{{ data.region_presets_name }}</td>
                <td class="border-b">{{ data.earthquake_presets_name }}</td>
                <td class="border-b text-center">{{ data.create_date }}</td>
                <td class="border-b">{{ data.calc_status_name }}</td>                
                <td class="border-b"><button class="border bg-slate-200 p-1" @click="clickSimulationReserveDetail(data.id)">詳細</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4">
          <button class="border bg-slate-200 p-1" @click="clickReturn">戻る</button>
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
