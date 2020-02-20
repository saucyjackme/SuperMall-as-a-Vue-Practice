<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                 class="tab-control1"
                 @tabClick="tabClick"
                 ref="topTapControl"
                 v-show="isTabFixed"></tab-control>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">

      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature></feature>
      <tab-control :titles="['流行','新款','精选']"
                   class="qqq"
                   @tabClick="tabClick"
                   ref="tabControl"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
<!--    组件监听需要加修饰符，.native-->
  </div>
</template>

<script>

  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import Feature from "./childComps/Feature";

  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import BackTop from "components/content/backTop/BackTop";


  import Scroll from 'components/common/scroll/Scroll'


  import {getHomeMultidata, getHomeGoods} from "network/home";
  import {debounce} from "assets/common/utils";
  import {itemListenerMixin} from "common/mixins";


  // import Swiper from "components/common/swiper";
  // import SwiperItem from "components/common/swiper/SwiperItem";

  export default {
    name: "Home",
    components:{
      NavBar,
      HomeSwiper,
      RecommendView,
      Feature,
      TabControl,
      getHomeGoods,
      GoodsList,
      Scroll,
      BackTop
    },
    mixins:[itemListenerMixin],
    data(){
      return{
        banners: [],
        recommends: [],
        goods:{
          'pop':{page: 0,list:[]},
          'new':{page: 0,list:[]},
          'sell':{page: 0,list:[]},
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
        itemImgListener: null
      }
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    activated() {
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
      // console.log("activated");
    },
    deactivated() {
      //获取Y值
      this.saveY = this.$refs.scroll.getScrollY()
      // console.log("deactivated");
      //取消全局事件监听
      this.$bus.$off('imageItemLoad',this.itemImgListener)
    },
    mounted() {
      // //3.开始监听item图片加载
      // let refresh = debounce(this.$refs.scroll.refresh,100)
      // //对监听的事件进行保存
      // this.itemImgListener = () => {
      //   refresh()
      // }
      // this.$bus.$on('imageItemLoad',this.itemImgListener)

      // //图片完成的加载监听，获取tabControl的offsettop
      // //但是这里是根据组件获取的，本应是获取组件中的元素，$el
      // this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
    },
    created() {
      //1.请求多个数据
      this.getHomeMultidata()
      //2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    methods:{
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
        // console.log(this.$refs.tabControl.$el.offsetTop);
      },
      loadMore() {
        this.getHomeGoods(this.currentType)
        // this.scroll.refresh()
      },
      contentScroll(position) {
        // console.log(position)
        //决定tabcontrol是否吸顶，position:fixed
        this.isTabFixed = -(position.y) > 543 ? true : false
        //判断backtop是否显示
        this.isShowBackTop = (-position.y) > 1000
      },
      //事件监听
      tabClick(index) {
        console.log(index);
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        if(this.$refs.topTabControl !== undefined) {
          this.$refs.topTabControl.currentIndex = index;
          this.$refs.tabControl.currentIndex = index;
        }
      },
      // 网络请求
      getHomeMultidata() {
        getHomeMultidata().then(res =>{
          //这里this是组件的对象this.result = res
          // console.log(res);
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type){

        const page = this.goods[type].page + 1

        getHomeGoods(type,page).then(res =>{
          // console.log(res);是一个data对象
          this.goods[type].list.push(...res.data.list)
          //由于多一组数据，页面需要+1
          this.goods[type].page += 1

          this.$refs.scroll.finishPullUp()
        })
      },

      backClick(){
        // console.log('组件是否监听');
        this.$refs.scroll.scroll.scrollTo(0,0)
        //this.$refs.scroll是组件对象，对象访问scroll方法
        // this.$refs.scroll.message
      }

    }

  }
</script>

<style scoped>
  #home{
    /*position: relative;*/
    /*padding-top: 44px;*/
    position: relative;
    height: 100vh;
  }
 .home-nav{
   background-color: var(--color-tint);
   color: #ffff;

   /*position: fixed;*/
   /*left: 0;*/
   /*right: 0;*/
   /*top: 0;*/
   /*z-index: 9;*/
 }

  .tab-control2{
    position: sticky;
    top:44px;
    z-index: 9;
  }

  .content{
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    right: 0;
    left: 0;
  }
  .tab-control {
    margin-top: 100px;
    position: fixed;
    z-index: 9;
  }
  .tab-control1{
    position: fixed;
    margin-top: 0px;
    width: 100%;
  }
  .qqq{
    width: 100%;
    margin-top: 0px;
    position: relative;
  }

</style>