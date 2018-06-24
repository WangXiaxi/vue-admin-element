import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import "babel-polyfill"
import { getStore } from './config/mUtils.js'
Vue.config.productionTip = false;

Vue.use(ElementUI);

// 路由拦截器,控制tabBar的显示隐藏
router.beforeEach((to, from, next) => {
  if (to.meta.loginVericat) {
    if(!getStore('UseId') || !getStore('UseName') || !getStore('Token')) {
      next({path: '/'})
    } else {
      next()
    }
  } else {
    next()
  }
})

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
