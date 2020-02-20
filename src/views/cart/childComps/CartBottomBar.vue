<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button"
                    :is-checked="isSelectAll"
                    @click.native="checkClick"></check-button>
      <span>全选</span>
    </div>
    <div class="price">
      合计:{{totalPrice}}
    </div>
    <div class="calculate" @click="calClick">
      去计算:({{checkedLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from "components/content/checkButton/CheckButton";
  export default {
    name: "CartBottomBar",
    components: {
      CheckButton
    },
    computed: {
      totalPrice() {
        //只有选中时才返回
        return '￥' + this.$store.getters.cartList.filter(item => {
          return item.checked
        }).reduce((preValue,item) => {
          return preValue + item.price * item.count
        },0).toFixed(2)
      },
      checkedLength() {
        return this.$store.state.cartList.filter(item => item.checked).length
      },
      isSelectAll() {
        //从数组中过滤不被选中的,然后全选状态取反
        // return !(this.$store.state.cartList.filter(item => !item.checked).length)
        if (this.$store.state.cartList.length === 0) return  false
        return !(this.$store.state.cartList.find(item => !item.checked))
      }
    },
    methods: {
      checkClick() {
        if(this.isSelectAll) {//全选
          this.$store.state.cartList.forEach(item => item.checked = false)
        }else {
          //有部分或全部未选中
          this.$store.state.cartList.forEach(item => item.checked = true)
        }
      },
      calClick() {
        if(!this.isSelectAll){
          this.$toast.show('请选择购买的商品',2000)
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    height: 40px;
    background-color: #eee;
    line-height: 40px;
    font-size: 15px;

    position: relative;
    display: flex;

  }

  .check-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 80px;
  }

  .check-button {
    height: 20px;
    width: 20px;
    line-height: 20px;
    margin-right: 10px;
  }
  .price {
    margin-left: 20px;
    flex: 1;
  }

  .calculate {
    width: 90px;
    background-color: orangered;
    color: #ffffff;
    text-align: center;
  }

</style>