import { createApp } from 'vue'
import App from './App.vue'
import KaKaoLogin from '@/KaKaoLoginPlugin'

const app = createApp(App);
app.use(KaKaoLogin, { apiKey: "30beed56058f9075dff3b03784534f00" });
app.mount('#app')
