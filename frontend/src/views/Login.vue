<template>
  <authenticator :services="services">
    <template v-slot:header>
      <div style="padding: var(--amplify-space-large)" class="text-center">
        <h1 class="amplify-heading">BRIDGE</h1>
      </div>
    </template>
    <template v-slot:footer>
      <div style="padding: var(--amplify-space-large)" class="text-center">
        <p class="amplify-text" style="color: var(--amplify-colors-neutral-80)">
          Powerd by AIGID
        </p>
      </div>
    </template>
    <Menu />
  </authenticator>
</template>

<script setup lang="ts">
import { Authenticator, translations } from "@aws-amplify/ui-vue";
import { Auth, I18n } from "aws-amplify";
import "@aws-amplify/ui-vue/styles.css";
import router from "../router";
import { useUserStore } from "../store/user";
import Menu from "./Menu.vue";

I18n.putVocabularies(translations);
I18n.setLanguage("ja");

const userStore = useUserStore();

const services = {
  handleSignIn: async (username: string, password: string) => {
    const user = await Auth.signIn(username, password);
    userStore.$state.Email = user.attributes.email;
    router.push({ name: "Menu" });
  },
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
