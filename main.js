import Vue from 'vue'
import App from './App'
// 导入基本 api 请求
import {myRequest} from './utils/api.js'
import _ from './utils/lodash.min.js'

import ZAudio from '@/components/uniapp-zaudio'
// import ZAudio from 'uniapp-zaudio' // npm引用方式

import store from './store'

let zaudio = new ZAudio({
  continuePlay: false, //续播
  autoPlay: false, //自动播放 部分浏览器不支持
});
Vue.prototype.$zaudio = zaudio; //挂载vue原型链上

Vue.prototype.$lodash = _

Vue.prototype.$myRequest = myRequest

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
  ...App
})
app.$mount()


