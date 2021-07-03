/**
 * 本地存储封装模块
 */
export const getItem = (name) => {
	// 从本地缓存中同步获取指定 key 对应的内容。
	let getdata = uni.getStorageSync(name)
	return getdata
}

export const setItem = (name, value) => {
	uni.setStorage({
		key: name,
		data: value
	})
}

export const removeItem = (name) => {
	uni.removeStorage({
		key: name
	})
}