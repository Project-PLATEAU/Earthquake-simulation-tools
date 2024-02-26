<template>
    <div class="m-10">
        <div class="text-xl">シミュレーション実行確認</div>
        <div class="mt-10">
          <label>以下の内容でシミュレーションを実行します。</label>
          <br/>
          <label>よろしいですか？</label>
        </div>
        <div class="mt-16 bg-slate-200 w-dvw h-48">
          <div >
            <label class="mt-12 pr-6 w-32 inline-block">地域</label>
            <label>{{ simulationReserveStore.RegionPresetName }}</label>
          </div>
          <div>
            <label class="mt-6 pr-6 w-32 inline-block">地振動データ</label>
            <label>{{ simulationReserveStore.EarthQuakePresetName }}</label>
          </div>
        </div>
        <div class="mt-32">
          <div class="text-right">
            <button class="border bg-slate-200 py-1 px-6 w-48" @click="clickSimulationCancel">キャンセル</button>
            <button class="border bg-slate-200 py-1 px-6 w-48 ml-6" @click="clickSimulationExecute">実行</button>
          </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useSimulationReserveStore } from "../store/SimulationReserve"
import { SimulationReserveApi } from "../apis/http/SimulationReserves";
import { SimulationReservePostRequestBody } from "../models/SimulationReserves";

const router = useRouter();
const simulationReserveStore = useSimulationReserveStore();
const apiClient = new SimulationReserveApi();

const clickSimulationExecute = async ()=>{
  try {
    // 登録
    const registData: SimulationReservePostRequestBody = { 
      user_id: 12,
      region_preset_id: simulationReserveStore.RegionPresetId,
      earthquake_preset_id: simulationReserveStore.EarthQuakePresetId,
    };
    const res = await apiClient.create(registData);
    if (!res.id) {
      alert("シミュレーションの実行に失敗しました。システム管理者にお問い合わせください。");
      return false;
    }
    // シミュレーション予約完了画面に遷移
    router.push({name: "SimulationReserveRegistComplete"});
  } catch (e){

  }
}

const clickSimulationCancel = async ()=>{
  try {
    // メニュー画面へ
    router.push({name: "Menu"});
  } catch (e){
    // TODO: エラー共通化
    console.log(e);
  }
}

</script>