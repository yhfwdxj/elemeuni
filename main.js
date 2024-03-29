import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
import {
  request
} from '@/utils/request.js'
import store from "@/store"
import './mock/index.js'

export function createApp() {
  const app = createSSRApp(App)
  app.provide('request', request)
  app.use(store)
  return {
    app
  }
}
// #endif