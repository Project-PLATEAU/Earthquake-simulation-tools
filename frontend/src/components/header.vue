<template>
  <header class="flex h-10 items-center border-y-2 p-2 bg-gray-200">
    <nav>
      <button class="fixed top-2 z-10" @click="clickHumberger">
        <fa icon="bars" :class="{ hidden: isOpenHumberger }" />
        <fa icon="xmark" :class="{ hidden: !isOpenHumberger }"  />
      </button>
      <ul 
        class="fixed p-3 pt-10 top-0 left-0 z-0 w-full bg-gray-300 text-xl text-black transition-all ease-linear"
        :class="{ 'translate-x-full': !isOpenHumberger }"
        >
            <span class="text-lg">プリセット管理</span>
            <li><a class="ml-6 hover:cursor-pointer" @click="clickToCityGmlPresetList">CityGMLプリセット</a></li>
            <li><a class="ml-6 hover:cursor-pointer" @click="clickToEarthQuakePresetList">地震動プリセット</a></li>
            <li><a href="#reservesimulation">シミュレーション予約登録</a></li>
            <li><a href="#managesimulation">シミュレーション管理</a></li>
      </ul>
    </nav>
    <span class="fixed right-72">{{ userStore.Email }}</span>
    <button class="fixed text-blue-500 text-sm right-6" @click="clickSignOut">SignOut</button>
  </header>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Auth } from 'aws-amplify';
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user"

const router = useRouter();
const userStore = useUserStore();
const clickHumberger = () => {
    isOpenHumberger.value = !isOpenHumberger.value;
}
const isOpenHumberger = ref<boolean>(false);

// ログイン状態チェック
const loginCheck = async() => {
  try {
    const currentAuthUser = await Auth.currentAuthenticatedUser();
    const session = await Auth.userSession(currentAuthUser);
    // session が有効でない場合はログインに戻る
    if (!session?.isValid()) {
      await Auth.signOut();
      // セッションとCookieの削除
      sessionStorage.clear()
      document.cookie = 'max-age=0';
      router.push({name: "Login"});
    };
  } catch(e){
    //ログインユーザー、セッションの取得に失敗し場合はログイン状態が有効でないため再ログインを促す
    await Auth.signOut();
    sessionStorage.clear()
    document.cookie = 'max-age=0';
    router.push({name: "Login"});
  }
}
loginCheck();

const clickToCityGmlPresetList = () => {
    // 地域プリセット一覧に遷移する
    router.push({name: "RegionPresetList"});
    isOpenHumberger.value = false;
}

const clickToEarthQuakePresetList = () => {
    // 地振動プリセット一覧に遷移する
    router.push({name: "EarthQuakePresetList"});
    isOpenHumberger.value = false;
}

const clickSignOut = async() => {
  await Auth.signOut();

  // セッションとCookieの削除
  sessionStorage.clear()
  document.cookie = 'max-age=0';

  router.push({name: "Login"});
}

</script>