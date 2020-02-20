import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import toast from  'components/common/toast'
//添加fastclick,解决移动端300ms延迟

import FastClick from 'fastclick'
FastClick.attach(document.body)
//实现图片懒加载=>src ===>v-lazy
import VueLazyload from "vue-lazyload";
Vue.use(VueLazyload,{
  loading: require('assets/img/common/placeholder.png')
})

//添加事件总线
Vue.prototype.$bus = new Vue()
//安装toast插件,本质上调用toast的install函数
Vue.use(toast)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
  router
}).$mount('#app')
