import {getItem} from './storage.js'

const BASE_URL = 'http://120.79.189.150:8001'
// const BASE_URL = '/api'	// 浏览器调试解决跨域
// options 就是调用这个方法的参数 就是 {}
export const myRequest = (options) => {
	return new Promise((resolve,reject)=>{
		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: {Authorization: getItem('token')},
			success: (res) => {
				// 没有 token 无法发起请求
				// if(res.data.data.token || getItem('token')) {
				resolve(res)
			},
			fail: (err)=> {
				uni.showToast({
					title: '请求接口失败'
				})
				reject(err)
			}	
		})
	})
}

