<template>
  <div class="m-10 regist-view confirm-simulation">
    <div class="text-xl font-bold">シミュレーション実行確認</div>
    <div class="text-center">
      <div class="mt-10 text-left w-[770px] mt-[60px] mb-0 mx-auto">
        <label>以下の内容でシミュレーションを実行します。</label>
        <br/>
        <label>よろしいですか？</label>
      </div>
      <div class="border border-solid border-blue-500 h-40 w-[770px] mt-[10px] mx-auto mb-0">
        <div class="mt-12">
          <label class="inline-block text-left text-base font-bold w-48">地域</label>
          <label class="inline-block text-left w-[500px]">{{ simulationReserveStore.RegionPresetName }}</label>
        </div>
        <div class="mt-6">
          <label class="inline-block text-left text-base font-bold w-48">地振動データ</label>
          <label class="inline-block text-left w-[500px]">{{ simulationReserveStore.EarthQuakePresetName }}</label>
        </div>
      </div>
      <div class="mt-32 text-center flex justify-center space-x-6">
        <button class="bg-blue-500 text-white text-xs h-8 leading-4 rounded-md py-[10px] px-[16px]" @click="clickSimulationCancel">キャンセル</button>
        <button class="bg-blue-500 text-white text-xs h-8 leading-4 rounded-md py-[10px] px-[16px]" @click="clickSimulationExecute">実行</button>
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