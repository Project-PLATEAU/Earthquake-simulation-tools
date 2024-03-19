<template>
  <div class="w-full rounded-circle login">
    <div class="relative overflow-hidden bg-black w-full h-[450px]">
      <img
        class="w-full object-cover opacity-65 h-[450px]"
        src="../assets/kanban.jpeg"
      />
      <p
        class="absolute w-full text-center translate-x-[50%] left-[50%] text-teal-400 text-base top-[200px]"
      >
        PROJECT PLATEAU
      </p>
      <p
        class="absolute w-full text-center translate-x-[50%] left-[50%] text-white top-[250px] text-[40px]"
      >
        建物振動に関する大規模シミュレーション
      </p>
    </div>
    <form>
      <p class="ml-24 text-teal-400 text-base mt-5">SYSTEM LOGIN FORM</p>
      <p class="ml-24 text-gray-900 text-2xl">システムログインフォーム</p>
      <p class="ml-24 text-gray-900 text-base">
        建物振動に関する大規模シミュレータ
      </p>
      <!-- ログイン -->
      <div class="mx-auto my-0 w-[400px]" v-if="!isSignUp">
        <div class="mb-3 mt-5">
          <label class="inline-block text-xs" for="inputEmail">User ID</label>
          <input
            type="email"
            class="h-10 rounded-md border border-solid border-gray-300 w-[400px]"
            id="inputEmail"
            aria-describedby="emailHelp"
            v-model="inputLoginEmail"
            placeholder="メールアドレスを入力してください"
          />
        </div>
        <div class="mb-6">
          <label class="inline-block text-xs" for="inputPassword"
            >Password</label
          >
          <input
            type="password"
            class="h-10 rounded-md border border-solid border-gray-300 w-[400px]"
            id="inputPassword"
            v-model="inputLoginPassword"
            placeholder="********"
          />
        </div>
        <div class="text-center">
          <button
            @click.prevent="onClickLogin"
            class="bg-blue-500 w-40 h-10 text-white text-xs mx-auto d-block"
          >
            ログイン
          </button>
          <a
            class="block text-xs underline hover:cursor-pointer"
            @click="switchSignUp"
            >アカウント登録</a
          >
        </div>
      </div>
      <!-- サインアップ -->
      <div class="mx-auto my-0 w-[400px]" v-if="isSignUp && !isSignUpConfirm">
        <div class="mb-3 mt-5">
          <label class="inline-block text-xs" for="inputEmail">User ID</label>
          <input
            type="email"
            class="h-10 rounded-md border border-solid border-gray-300 w-[400px]"
            id="inputEmail"
            aria-describedby="emailHelp"
            v-model="inputSignUpEmail"
            placeholder="メールアドレスを入力してください"
          />
        </div>
        <div class="mb-6">
          <label class="inline-block text-xs" for="inputPassword"
            >Password</label
          >
          <input
            type="password"
            class="h-10 rounded-md border border-solid border-gray-300 w-[400px]"
            id="inputPassword"
            v-model="inputSignUpPassword"
            placeholder="********"
          />
        </div>
        <div class="text-center">
          <button
            @click.prevent="onClickSignUp"
            class="bg-blue-500 w-40 h-10 text-white text-xs mx-auto d-block"
          >
            登録
          </button>
          <span class="block text-xs"
            >アカウントをお持ちの場合は<a
              class="inline-block text-xs hover:cursor-pointer"
              @click="switchLogin"
              >ログイン</a
            ></span
          >
        </div>
      </div>
      <!-- サインアップ確認コード入力 -->
      <div class="mx-auto my-0 w-[400px]" v-if="isSignUp && isSignUpConfirm">
        <p class="text-xs">
          送信先: {{ signUpEmailDestination }}にコードを送信しました。
        </p>
        <p class="text-xs">
          ログインするには、メールに記載されたコードを入力してください。
          到着するまでに 1 分かかることがあります.
        </p>
        <div class="mb-3">
          <label class="inline-block text-xs" for="inputEmail"
            >Confirmation Code</label
          >
          <input
            type="text"
            class="h-10 rounded-md border border-solid border-gray-300 w-[400px]"
            id="inputConfirmCode"
            v-model="inputSignUpConfirmCode"
            placeholder="確認コードを入力してください"
          />
        </div>
        <div class="text-center">
          <button
            @click.prevent="onClickSignUpConfirmation"
            class="bg-blue-500 w-40 h-10 text-white text-xs mx-auto d-block"
          >
            確定
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import router from "../router";
import { useUserStore } from "../store/user";
import { login, signUp, signUpConfirmation } from "../modules/cognito";

const inputLoginEmail = ref("");
const inputLoginPassword = ref("");
const inputSignUpEmail = ref("");
const inputSignUpPassword = ref("");
const inputSignUpConfirmCode = ref("");
const userStore = useUserStore();
const isSignUp = ref(false);
const isSignUpConfirm = ref(false);
const signUpEmailDestination = ref("");

/** ログイン */
const onClickLogin = async () => {
  try {
    await login(inputLoginEmail.value, inputLoginPassword.value);
    userStore.$state.Email = inputLoginEmail.value;
    router.push({ name: "Menu" });
  } catch (e: any) {
    alert(e.message);
  }
};

/** サインアップ */
const onClickSignUp = async () => {
  try {
    const result = await signUp(
      inputSignUpEmail.value,
      inputSignUpPassword.value
    );
    signUpEmailDestination.value = result?.codeDeliveryDetails.Destination!;
    isSignUpConfirm.value = true;
  } catch (e: any) {
    alert(e.message);
  }
};

/** サインアップ確認コード入力 */
const onClickSignUpConfirmation = async () => {
  try {
    await signUpConfirmation(
      inputSignUpEmail.value,
      inputSignUpConfirmCode.value
    );
    // サインアップに成功したらログインもする
    await login(inputSignUpEmail.value, inputSignUpPassword.value);
    userStore.$state.Email = inputSignUpEmail.value;
    router.push({ name: "Menu" });
  } catch (e: any) {
    alert(e.message);
  }
};

const switchSignUp = () => {
  isSignUp.value = true;
};
const switchLogin = () => {
  isSignUp.value = false;
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
