<template>
  <div class="mt-10 mb-5 sm:max-w-md sm:w-full sm:mx-auto sm:overflow-hidden">
    <div class="text-xl">機能選択メニュー</div>
  </div>

  <div
    class="bg-white rounded-lg sm:max-w-md sm:w-full sm:mx-auto sm:overflow-hidden border border-blue-200"
  >
    <div class="mt-6">
      <div class="w-full">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-base font-semibold leading-6 text-gray-900">
            プリセット管理
          </h3>
        </div>
        <div class="px-4">
          <ul>
            <li>
              <a
                @click="clickToCityGmlPresetList"
                class="text-gray-700 hover:text-indigo-600 hover:bg-gray-100 group flex gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold underline hover:cursor-pointer"
                >地域プリセット</a
              >
            </li>
            <li>
              <a
                @click="clickToEarthQuakePresetList"
                class="text-gray-700 hover:text-indigo-600 hover:bg-gray-100 group flex gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold underline hover:cursor-pointer"
                >地震動プリセット</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="w-full">
        <hr class="h-px my-4 bg-blue-200 border-0" />
        <div class="px-4 py-5">
          <ul>
            <li>
              <a
                @click="clickToReserveSimulation"
                class="text-gray-700 hover:text-indigo-600 hover:bg-gray-100 group flex gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold underline hover:cursor-pointer"
                >シミュレーション予約登録</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="w-full">
        <hr class="h-px my-4 bg-blue-200 border-0" />
        <div class="px-4 py-5">
          <ul>
            <li>
              <a
                @click="clickToManageSimulation"
                class="text-gray-700 hover:text-indigo-600 hover:bg-gray-100 group flex gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold underline hover:cursor-pointer"
                >シミュレーション管理</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const clickToCityGmlPresetList = () => {
  // 地域プリセット一覧に遷移する
  router.push({ name: "RegionPresetList" });
};

const clickToEarthQuakePresetList = () => {
  // 地振動プリセット一覧に遷移する
  router.push({ name: "EarthQuakePresetList" });
};

const clickToReserveSimulation = () => {
  // シミュレーション予約登録に遷移する
  router.push({ name: "SimulationReserveRegistInput" });
};

const clickToManageSimulation = () => {
  // シミュレーション管理に遷移する
  router.push({ name: "SimulationReserveList" });
};
</script>

<style scoped>
a {
  text-decoration: underline;
}
a:hover {
  cursor: pointer;
}
</style>
