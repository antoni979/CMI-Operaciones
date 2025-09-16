import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // Importamos el router
import './style.css'      // Importamos los estilos de Tailwind

const app = createApp(App)

app.use(createPinia()) // Inicializa Pinia para gestión de estado
app.use(router)      // Inicializa Vue Router para la navegación

app.mount('#app')