import Vue from 'vue'
import Vuex from 'vuex'
import {getItem, setItem} from '../utils/storage.js'
// 1.安装插件
Vue.use(Vuex)

// 定义一个常量
const USER_KEY = 'userInfo'

// 2.创建Store对象
const store = new Vuex.Store({
	state: {
		// 系统状态栏的高度
		systemBarHeight: 0,
		// 用户登录信息
		userInfo: getItem(USER_KEY),
		// 用于判断文件页面是否需要重新读取数据
		isFileRequest: false,
		// 上传进度
		progress: 0,
		// 已经上传的数据长度
		nowProgress: 0,
		// 预期需要上传的数据总长度
		totalProgress: 0,
		// 正在传输的图片地址
		transmissionImg: "",
		// 下载进度
		downProgress: 0,
		downNowProgress: 0,
		downTotalProgress: 0
	},
	getters: {
		fileSizeInfo: (state, getters) => {
			if(state.userInfo.neicun < 1024 && state.userInfo && state.userInfo.neicun) {
				return state.userInfo.neicun.toFixed(2) + 'Byte'
			} else if(state.userInfo.neicun < 1024 * 1024) {
				return (state.userInfo.neicun / 1024).toFixed(2) + 'KB'
			} else if(state.userInfo.neicun < 1024 * 1024 * 1024) {
				return (state.userInfo.neicun / 1024 / 1024).toFixed(2) + 'M'
			} else if(state.userInfo.neicun < 1024 * 1024 * 1024 * 1024) {
				return (state.userInfo.neicun / 1024 / 1024 / 1024).toFixed(2) + 'G'
			} else {
				return 'GG OVER'
			}
		},
	},
	mutations: {
		setSystemBarHeight(state, data) {
			state.systemBarHeight = data
		},
		// 保存登录的用户信息
		setUserInfo(state, data) {
			state.userInfo = data
			// 为了防止页面刷新数据丢失 我们还需要把数据放到本地存储中 是为了持久化数据
			setItem(USER_KEY, state.userInfo)
		},
		setFileRequest(state, data) {
			state.isFileRequest = data
		},
		setProgress(state, data) {
			state.progress = data
		},
		setNowProgress(state, data) {
			state.nowProgress = data
		},
		setTotalProgress(state, data) {
			state.totalProgress = data
		},
		setTransmissionImg(state, data) {
			state.transmissionImg = data
		},
		setDownProgress(state, data) {
			state.downProgress = data
		},
		setDownNowProgress(state, data) {
			state.downNowProgress = data
		},
		setDownTotalProgress(state, data) {
			state.downTotalProgress = data
		}
	},
	actions: {
		
	}
})

// 3.导出，挂载Vue实例上
export default store
