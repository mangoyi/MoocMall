import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodList',
      component: () => import('../views/GoodsList')
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('../views/Cart')
    },
    {
      path: '/address',
      name: 'Address',
      component: () => import('../views/Address')
    },
    {
      path: '/orderConfirm',
      name: 'orderConfirm',
      component: () => import('../views/orderConfirm')
    }
  ]
})
