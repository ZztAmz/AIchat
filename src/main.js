import 'babel-polyfill'
import 'classlist-polyfill'
import Vue from 'vue'
import axios from './router/axios'
import VueAxios from 'vue-axios'
import App from './App'
import './permission' // 权限
import './error' // 日志
import './cache'//页面缓冲
import router from './router/router'
import store from './store'
import {loadStyle, downBlobFile} from './util'
import {validatenull} from './util/validate'
import * as urls from '@/config/env'
import {iconfontUrl, iconfontVersion} from '@/config/env'
import * as filters from './filters' // 全局filter
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/common.scss'
import AvueFormDesign from '@sscfaith/avue-form-design'
import basicContainer from './components/basic-container/main'
// 字典数据组件
import DictResolver from '@/components/DictResolver'
// 字典标签组件
import DictTag from '@/components/DictTag'

// 挂载常用全局方法，import 引入
Vue.prototype.validatenull = validatenull
Vue.prototype.downBlobFile = downBlobFile

DictResolver.install()

// 插件 json 展示
Vue.use(router)
// 表单设计器
Vue.use(AvueFormDesign);

window.axios = axios
Vue.use(VueAxios, axios)

Vue.use(ElementUI, {
  size: 'small',
  menuType: 'text'
})

Vue.use(AVUE, {
  size: 'small',
  menuType: 'text'
})

// 注册全局容器
Vue.component('basicContainer', basicContainer)
Vue.component('DictTag', DictTag)

// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key]
})

// 加载过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele))
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
