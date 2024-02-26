<template>
    <div class="mt-48">
        <div class="mt-10 text-center">
          <label>シミュレーションの実行予約が完了しました</label>
        </div>
        <div class="mt-32">
          <div class="text-center">
            <button class="border bg-slate-200 py-1 px-6 w-64" @click="clickSimulationList">シミュレーション予約一覧</button>
          </div>
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