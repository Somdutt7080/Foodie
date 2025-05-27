import { createApp } from 'vue'
import App from './App.vue'
import router from '../src/router/index.js'
import store from '../src/store/index.js'
import vuetify from './plugins/vuetify'
import 'vuetify/styles'
import './style.css'
createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .mount('#app')