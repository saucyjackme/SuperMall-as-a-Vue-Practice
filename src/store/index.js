import Vue from 'vue'
import Vuex from 'vuex'
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";


//1.Vue安装插件
Vue.use(Vuex)
//2.创建vuex.store对象并导出
const state = {
  cartList:[]
}
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
