import {request} from './request'

export function getHomeMultidata(type,page) {
  return request({
    url:'/home/multidata',
    params:{
      type,
      page
    }
  })
}

export function getHomeGoods(type,page) {
  return request({
    url:'/home/data',
    params:{
      type,
      page
    }

  })
}