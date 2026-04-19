import { createApp } from 'vue'
import pinia from './stores'   // [!code ++]

import 'element-plus/theme-chalk/src/index.scss'  

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(pinia)   // [!code ++]

app.use(router)

app.mount('#app')
