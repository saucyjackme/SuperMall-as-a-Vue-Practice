<template>
<!--  //ref/children 一般给子组件帮ref-->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props:{
      probeType:{
        type: Number,
        default:0
      },
      pullUpLoad:{
        type: Boolean,
        default: false
      }
    },
    data(){
      return{
        scroll:null
      }
    },
    mounted() {
      //1：创建BS对象
      this.scroll = new BScroll(this.$refs.wrapper,{
        probeType: this.probeType,
        click: true,
        pullUpLoad: this.pullUpLoad
      })


      //2:监听滚动位置
      if (this.probeType === 2 || this.probeType === 3){
        this.scroll.on('scroll',(position) =>{
          // console.log(position);-590

          this.$emit('scroll',position)
        })
      }
      //3:监听scroll滚动到底部
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp',() =>{
          this.$emit('pullingUp')
        })
      }
    },
    methods:{
      scrollTo(x,y,time = 500) {
        this.scroll  && this.scroll.scrollTo(x,y,time)
      },
      finishPullUp() {
        // console.log("结束上拉");
        this.scroll && this.scroll.finishPullUp()
      },
      refresh() {
        // console.log('.....');
        this.scroll && this.scroll.refresh()
      },
      getScrollY() {
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>

</style>