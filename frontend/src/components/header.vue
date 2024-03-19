<template>
  <header class="flex h-10 items-center border-y-2 p-2 bar">
    <nav>
      <button class="top-2 z-10" @click="clickHumberger">
        <Bars4Icon
          class="w-6 h-6 text-white"
          :class="{ hidden: isOpenHumberger }"
        />
        <XMarkIcon
          class="w-6 h-6 text-white"
          :class="{ hidden: !isOpenHumberger }"
        />
      </button>
      <ul
        class="fixed p-3 top-0 left-0 z-0 w-full bg-gray-300 text-black transition-all ease-linear text-sm"
        :class="{ 'translate-x-full': !isOpenHumberger }"
      >
        <li>
          <a class="cursor-pointer" @click="closeMenu"
            ><XMarkIcon class="w-6 h-6 text-black"
          /></a>
        </li>
        <li>
          <a
            class="text-gray-700 hover:text-indigo-600 hover:bg-gray-100 group gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold cursor-pointer"
            @click="clickToMenu"
            >メニュー</a
          >
        </li>
        <li>
          <a
            class="text-gray-700 hover:text-indigo-600 hover:bg-gray-100 group gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold cursor-pointer"
            @click="clickToCityGmlPresetList"
            >地域プリセット</a
          >
        </li>
        <li>
          <a
            class="text-gray-700 hover:text-indigo-600 hover:bg-gray-100 group gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold cursor-pointer"
            @click="clickToEarthQuakePresetList"
            >地震動プリセット</a
          >
        </li>
        <li>
          <a
            class="text-gray-700 hover:text-indigo-600 hover:bg-gray-100 group gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold cursor-pointer"
            @click="clickToReserveSimulation"
            >シミュレーション予約登録</a
          >
        </li>
        <li>
          <a
            class="text-gray-700 hover:text-indigo-600 hover:bg-gray-100 group gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold cursor-pointer"
            @click="clickToManageSimulation"
            >シミュレーション管理</a
          >
        </li>
      </ul>
    </nav>
    <span class="user-info-area ml-5">{{ userStore.Email }}</span>
    <button class="text-blue-400 text-sm right-6 ml-auto" @click="clickSignOut">
      LOGOUT
    </button>
  </header>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Auth } from "aws-amplify";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";
import { Bars4Icon, XMarkIcon } from "@heroicons/vue/24/solid";

const router = useRouter();
const userStore = useUserStore();
const clickHumberger = () => {
  isOpenHumberger.value = !isOpenHumberger.value;
};
const isOpenHumberger = ref<boolean>(false);

// ログイン状態チェック
const loginCheck = async () => {
  try {
    const currentAuthUser = await Auth.currentAuthenticatedUser();
    const session = await Auth.userSession(currentAuthUser);
    // session が有効でない場合はログインに戻る
    if (!session?.isValid()) {
      await Auth.signOut();
      // セッションとCookieの削除
      sessionStorage.clear();
      document.cookie = "max-age=0";
      router.push({ name: "Login" });
    } else {
      userStore.Email = currentAuthUser.attributes.email;
    }
  } catch (e) {
    //ログインユーザー、セッションの取得に失敗し場合はログイン状態が有効でないため再ログインを促す
    await Auth.signOut();
    sessionStorage.clear();
    document.cookie = "max-age=0";
    router.push({ name: "Login" });
  }
};
loginCheck();

const closeMenu = () => {
  isOpenHumberger.value = false;
};

const clickToMenu = () => {
  // メニューに遷移する
  router.push({ name: "Menu" });
  isOpenHumberger.value = false;
};

const clickToCityGmlPresetList = () => {
  // 地域プリセット一覧に遷移する
  router.push({ name: "RegionPresetList" });
  isOpenHumberger.value = false;
};

const clickToEarthQuakePresetList = () => {
  // 地振動プリセット一覧に遷移する
  router.push({ name: "EarthQuakePresetList" });
  isOpenHumberger.value = false;
};

const clickToReserveSimulation = () => {
  // シミュレーション予約登録に遷移する
  router.push({ name: "SimulationReserveRegistInput" });
  isOpenHumberger.value = false;
};

const clickToManageSimulation = () => {
  // シミュレーション管理に遷移する
  router.push({ name: "SimulationReserveList" });
  isOpenHumberger.value = false;
};

const clickSignOut = async () => {
  await Auth.signOut();

  // セッションとCookieの削除
  sessionStorage.clear();
  document.cookie = "max-age=0";

  router.push({ name: "Login" });
};
</script>

<style scoped>
header.bar {
  background-color: #28293e;
  font-size: 12px;
}
header .user-info-area {
  color: white;
}
</style>
