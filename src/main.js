import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router'
import App from './App.vue'
import './style.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/700.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
