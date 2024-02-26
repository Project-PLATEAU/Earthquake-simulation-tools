import { createApp } from 'vue'
import { createPinia } from 'pinia';
import router from "./router"
import App from './App.vue'
import './main.css';
import { Amplify } from 'aws-amplify';
import { worker } from './mocks/browser'
import axios from 'axios'
import 'maplibre-gl/dist/maplibre-gl.css';

Amplify.configure({
    // Amazon Cognito認証用の初期設定
    Auth: {
        region: import.meta.env.VITE_COGNITO_REGION,
        userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
        userPoolWebClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
        identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID
    }
});

var app = createApp(App)
const pinia = createPinia();

//コンポーネントの追加
app.use(router)
app.use(pinia);
if (import.meta.env.VITE_MODE == 'mock') {
    worker.start();
}
if (import.meta.env.VITE_MODE == 'production') {
    axios.defaults.baseURL = import.meta.env.VITE_APP_API_ENDPOINT;
}

console.log(import.meta.env);

app.mount('#app')