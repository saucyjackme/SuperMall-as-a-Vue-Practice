import Toast from "./Toast";

const obj = {

}
obj.install = function (Vue) {
  //1.创建组件构造器
  const toastContrustor = Vue.extend(Toast)
  //2.根据组件构造器，创建出一个组件对象
  const toast  = new toastContrustor()
  //3.根据组件对象，手动挂载到某个元素上
  toast.$mount(document.createElement('div'))
  //4.创建元素后，将toast.$el添加到div
  document.body.appendChild(toast.$el)
  Vue.prototype.$toast = toast;
}


export default obj