<template>
  <div class="cart">
<!--导航-->
    <nav-bar class="nav-bar">
      <div slot="center">商品种类({{cartLength}})</div>
    </nav-bar>
<!--列表-->
    <cart-list></cart-list>
<!--汇总-->
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import CartList from "./childComps/CartList";
  import CartListItem from "./childComps/CartListItem";
  import CartBottomBar from "./childComps/CartBottomBar";

  import {mapGetters} from 'vuex'

  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      CartListItem,
      CartBottomBar
    },
    computed: {
      ...mapGetters(['cartLength','cartList'])
      }
  }
</script>

<style scoped>
  .cart {
    height: 100vh;
  }

  .nav-bar {
    background-color:var(--color-high-text);
    color: #ffffff;
  }
</style>