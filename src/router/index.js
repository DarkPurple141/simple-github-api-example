import Vue from 'vue'
import Router from 'vue-router'
import API from '@/components/API'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'API',
      component: API
    }
  ]
})
