<template>
	<view class="login">
		<view class="logo">
			<image src="/static/img/space-logo2.png" mode="aspectFit"></image>
			<view class="logo-title">小破盘</view>
		</view>
		<view class="main">
			<view class="login-input">
				<input 
				class="account" 
				type="text"
				:value="mobile" 
				placeholder="请输入手机号"
				placeholder-class="placeholder-class"
				@blur="saveMobile"
				/>
				<input 
				class="password" 
				:password="true"
				:value="password" 
				placeholder="请输入密码"
				placeholder-class="placeholder-class"
				@blur="savePassword"
				/>
			</view>
			<view class="login-button">
				<text @click="login" class="iconfont icon-arrow-right"></text>
			</view>
			<view class="registered">
				<view class="registered-wrap" @click="toRegistered">
					<text class="iconfont icon-user"></text>
					<text>注册</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import {getItem, setItem} from '../../utils/storage.js'
	
	export default {
		data() {
			return {
				// 账号
				mobile: "",
				// 密码
				password: ""
			}
		},
		onLoad() {
		
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods:{
			// 失去焦点的时候保存输入的手机号
			saveMobile(event) {
				this.mobile = event.detail.value
			},
			savePassword(event) {
				this.password = event.detail.value
			},
			
			// 点击登录
			async login() {
				const {data} = await this.$myRequest({
					url: '/educenter/member/login',
					method: 'POST',
					data: {
						mobile: this.mobile,
						password: this.password
					}
				})
				setItem('token', data.data.token)
				let token = getItem('token')
				// 将用户登录信息放到 vuex 容器中
				this.$store.commit('setUserInfo', data.data.mem)
				// 告诉页面要重新请求数据
				this.$store.commit('setFileRequest', true)
				if(data.code === 20000) {
					uni.showToast({
						title: "登录成功",
						icon: "success",
						duration: 1000,
						success: () => {
							setTimeout(()=>{
								uni.switchTab({
									url: "/pages/file/file"
								})
							}, 1000)
						}
					})
				}
				else {
					uni.showToast({
						title: "手机号或密码错误",
						icon: "none",
						duration: 1000
					})
				}
			},
			// 跳转到注册界面
			toRegistered() {
				uni.navigateTo({
					url: '/pages/registered/registered'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		// background: #f5f5f6;
	}
	.logo {
		margin-top: 200rpx;
		margin-bottom: 60rpx;
		text-align: center;
		image {
			width: 300rpx;
			height: 200rpx;
		}
		.logo-title {
			font-size: 60rpx;
			font-weight: bold;
		}
	}
	.main {
		.login-input {
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			input {
				width: 500rpx;
				height: 120rpx;
				border-bottom: 5rpx solid #EEEEEE;
				margin-top: 20rpx;
				font-size: 40rpx;
				padding: 0 20rpx;
				color: #333333;
			}
			// 输入框默认值样式
			/deep/ .placeholder-class {
				font-size: 40rpx;
				color: #CCCCCC;
			}
		}
		.login-button {
			margin-top: 100rpx;
			text-align: center;
			.iconfont {
				display: inline-block;
				width: 120rpx;
				height: 120rpx;
				line-height: 120rpx;
				text-align: center;
				background-color: #bbb;
				border-radius: 50%;
				overflow: hidden;
				color: #FFFFFF;
				font-size: 80rpx;
			}
			
		}
		.registered {
			margin-top: 100rpx;
			text-align: center;
			.registered-wrap {
				display: inline-block;
				padding: 10rpx 20rpx;
				border: 1rpx solid #999;
				border-radius: 20rpx;
				background-color: #fafafa;
				text {
					font-size: 35rpx;
					color: #888;
				}
				.iconfont {
					margin-right: 10rpx;
				}
			}
			
		}
	}
</style>
