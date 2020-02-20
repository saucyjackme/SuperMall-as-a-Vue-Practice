import {
  ADD_COUNTER,
  ADD_CART
} from './mutation-types'
export default {
  addCart(context,payload) {
    return new Promise((resolve,reject) => {
      // state.cartList.push(payload)
      //需要对不同商品进行判断，iid
      //查找之前的数组中是否已有该商品
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      //判断OldProduct
      if(oldProduct) {
        // oldProduct.count += 1数量加1
        context.commit(ADD_COUNTER,oldProduct)
        resolve('当前商品数量+1')
      }else {
        //添加新的商品
        payload.count = 1
        // context.state.cartList.push(payload)
        context.commit(ADD_CART,payload)
        resolve('添加新商品')
      }
    })
  }
}