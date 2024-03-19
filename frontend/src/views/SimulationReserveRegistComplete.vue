<template>
    <div class="mt-60 regist-view complete-simulation">
        <div class="text-center">
          <label>シミュレーションの実行予約が完了しました</label>
        </div>
        <div class="mt-12 text-center flex justify-center">
          <button class="bg-blue-500 text-white text-xs h-8 leading-4 rounded-md py-[10px] px-[16px]" @click="clickSimulationList">シミュレーション予約一覧</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const clickSimulationList = async ()=>{
  try {
    // シミュレーション予約一覧へ
    router.push({name: "SimulationReserveList"});
  } catch (e){
    // TODO: エラー共通化
    console.log(e);
  }
}
</script>