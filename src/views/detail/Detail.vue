<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imgLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addCart="addCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <toast :message="message" :show="show"></toast>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";
import BackTop from "components/content/backTop/BackTop";

import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "network/detail";
import {debounce} from "assets/common/utils";
import {itemListenerMixin} from "common/mixins";
import {backTopMixin} from "common/mixins";
import {BACKTOP_DISTANCE} from "common/const";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
import Toast from "components/common/toast/Toast";

export default {
    name: "Detail",
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,
      BackTop,
      Toast
    },
  mixins: [itemListenerMixin,backTopMixin],
  data(){
      return{
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        itemImgListener: null,
        themeTops:[],
        currentIndex: 0,
        isShowBackTop: false,
        message: '',
        show: false
      }
    },
  mounted() {
    },
  updated() {
      this.imageLoad()
  },
  //需要在页面销毁时取消事件
  destroyed() {
      this.$bus.$off('imageItemLoad',this.itemImgListener)
  },
  methods:{
    addCart() {
      // console.log('aaaaa');
      //1.获取购物车需要展示的信息
      const product = {}
      //购物车商品图片
      product.image = this.topImages[0];
      //商品标题
      product.title = this.goods.title;
      //商品描述
      product.desc = this.goods.desc;
      //价格
      product.price = this.goods.realPrice;
      product.iid = this.iid
      //2.将商品添加入购物车（vuex管理，全局，数据多界面共享）
      // this.$store.cartList.push(product)不要在这里直接修改，去mutations中
      // this.$store.commit('addCart',product) mutations中方法，commit
      this.$store.dispatch('addCart',product).then(res =>{
        // this.show = true;
        // this.message = res;
        //
        // setTimeout(() => {
        //   this.show = false
        // },1500)
        this.$toast.show(res,2000)

        console.log(this.$toast);
      })
    },
    imageLoad() {
        this.newRefresh()
        // this.themeTops = []
        // this.themeTops.push(0);
        // this.themeTops.push(this.$refs.params.$el.offsetTop);
        // this.themeTops.push(this.$refs.comment.$el.offsetTop);
        // this.themeTops.push(this.$refs.recommend.$el.offsetTop);
        // console.log(this.themeTops);
    },
    titleClick(index) {
      console.log(index);
      this.$refs.scroll.scrollTo(0,-this.themeTops[index],100)
    },
    contentScroll(position) {
      //获取Y值取反
      const positionY = -position.y
      // console.log(position);
      //与页面中的值进行对比
      let length = this.themeTops.length
      for(let i = 0;i < this.themeTops.length;i++) {
        if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTops[i] && positionY < this.themeTops[i+1]) || (i === length -1 && positionY >= this.themeTops[i]))){
          this.currentIndex = i;
          // console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
      //是否显示回到顶部
      this.isShowBackTop = -position.y > BACKTOP_DISTANCE
    },
    backClick(){
      this.$refs.scroll.scroll.scrollTo(0,0)
    }
  },
  created() {
      // console.log(this.$route.params);
      //1.保存传入的iid
      this.iid = this.$route.params.iid
      //2.根据iid请求详情数据（在网络里再封装一层）
      getDetail(this.iid).then(res =>{
        // console.log(res);
        const data = res.result;
        //1.获取顶部轮播图
        this.topImages = data.itemInfo.topImages
        //2.获取商品信息
        this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
        //3.获取店铺信息
        this.shop =  new Shop(data.shopInfo)
        //4.保存商品页详情
        this.detailInfo = data.detailInfo;
        //5.获取商品参数
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
        //6.获取评论信息（判断是否有评论）
        if(data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
        // this.themeTops = []
        // this.themeTops.push(0);
        // this.themeTops.push(this.$refs.params.$el.offsetTop);
        // this.themeTops.push(this.$refs.comment.$el.offsetTop);
        // this.themeTops.push(this.$refs.recommend.$el.offsetTop);
        //回调，保证都有值，根据最新数据对应DOM被渲染出来，但图片未全部加载完，即当前offsetTop不包含其中图片
        this.$nextTick(() =>{
          this.themeTops = []
          this.themeTops.push(0);
          this.themeTops.push(this.$refs.params.$el.offsetTop);
          this.themeTops.push(this.$refs.comment.$el.offsetTop);
          this.themeTops.push(this.$refs.recommend.$el.offsetTop);
          console.log(this.themeTops);
        })
      })
      //3.请求推荐数据
      getRecommend().then(res =>{
        // console.log(res);
        this.recommends = res.data.list
      })
    }
  }
</script>

<style scoped>
  #detail {
    height: 100vh;
    position: relative;
    z-index: 9;
    background-color: #ffffff;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #ffffff;
  }

  .content {
    height: calc(100% - 44px);
  }
</style>