<template>
  <div class="tab-bar-item" @click="itemClick">
<!--    <img src="../../assets/img/01_tabbar/home.svg" alt="">-->
<!--    <div>首页</div>-->
    <div v-if="!isActive">
      <slot name="item-icon"></slot>
    </div>
    <div v-else>
      <slot name="item-icon-active"></slot>
    </div>
    <div :style="activeStyle">
      <slot name="item-text"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TabBarItem",
    props:{
      path:String,
      activeColor:{
        type:String,
        default:'red'
      }
    },
    data(){
      return{
        // isActive:true
      }
    },
    computed:{
      isActive(){
        //传入当前路径跟当前活跃路由的路径比较，用indexof()方法，判断当前路径是否在此活跃路由中
        //其方法有一个返回值，出现第一次的位置，如未找到，值为-1，返回值跟-1比，如果相等，即为false,不等即为true，
        return this.$route.path.indexOf(this.path) !== -1
      },
      activeStyle(){
        //三元运算
        return this.isActive? {color:this.activeColor} : {}
      }
    },
    methods:{
      itemClick(){
        // console.log("点击")
        this.$router.replace(this.path)
      }
    }
  }
</script>

<style scoped>
  .tab-bar-item{
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 14px;
  }
  .tab-bar-item img{
    width: 24px;
    height: 24px;
    margin-top: 3px;
    vertical-align: middle;
    margin-bottom: 2px;
  }
  /*.active{*/
  /*  color: red;*/
  /*}*/
</style>