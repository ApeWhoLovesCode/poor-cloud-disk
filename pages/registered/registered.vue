<template>
  <view class='registered'>
		<view class="title">
			<text @click="backLogin" class="iconfont icon-arrow-left-bold"></text>
			<text class="title-name">注册</text>
			<text class="title-placeholder"></text>
		</view>
		<view class="main">
			<view class="login-input">
				<input
				class="account" 
				type="text" 
				:value="userInfo.nickname" 
				placeholder="请输入昵称"
				placeholder-class="placeholder-class"
				@blur="saveNickname"
				/>
				<input
				class="password" 
				:password="true"
				:value="userInfo.password" 
				placeholder="请输入密码"
				placeholder-class="placeholder-class"
				@blur="savePassword"
				/>
				<input
				class="account" 
				type="text" 
				:value="userInfo.mobile" 
				placeholder="请输入手机号码"
				placeholder-class="placeholder-class"
				@blur="saveMobile"
				/>
				<view class="code">
					<input
					class="account" 
					type="text" 
					:value="userInfo.code" 
					placeholder="请输入验证码"
					placeholder-class="placeholder-class"
					@blur="saveCode"
					/>
					<text @click="getCode">获取验证码</text>
				</view>
			</view>
			<view class="registered-button">
				<text @click="registered" class="iconfont icon-arrow-right"></text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
  name: 'registered',
  props: {},
  data() {
    return {
			userInfo: {
				avatar: "test",
				// 昵称
				nickname: "",
				// 密码
				password: "",
				// 电话
				mobile: "",
				// 验证码
				code: ""
			}
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
		saveNickname(event) {
			this.userInfo.nickname = event.detail.value
		},
		savePassword(event) {
			this.userInfo.password = event.detail.value
		},
		saveMobile(event) {
			this.userInfo.mobile = event.detail.value
		},
		saveCode(event) {
			this.userInfo.code = event.detail.value
		},
		// 获取验证码
		async getCode() {
			let reg = /^1[34578]\d{9}$/;
			let phone = this.userInfo.mobile
			// test() 方法只需要待测试字符串中包含了要测试的字符串就是ture
			if(reg.test(phone)) {
				const {data} = await this.$myRequest({
					url: `/edumsm/msm/send/${phone}`
				})
				if(data.code === 20000) {
					uni.showToast({
						title: '验证码发送成功',
						duration: 1500,
						position: 'top'
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '验证码发送失败',
						duration: 1500,
						position: 'top'
					})
				}
			} else {
				uni.showToast({
					icon: 'none',
					title: '手机号码格式错误',
					duration: 1000,
					position: 'top'
				})
			}
		},
		// 完成注册
		async registered() {
			let list = this.userInfo
			// 判断用户是否填写完信息
			for(let key in list) {
				if(!list[key]) {
					uni.showToast({
						icon: 'none',
						title: '请完善信息!!',
						duration: 1500,
						position: 'top'
					})
					return
				}
			}
			const {data} = await this.$myRequest({
				url: '/educenter/member/register',
				method: 'POST',
				data: {
					avatar: "",
					code: this.userInfo.code,
					mobile: this.userInfo.mobile,
					nickname: this.userInfo.nickname,
					password: this.userInfo.password
				}
			})
			// console.log(data)
			if(data.code === 20000) {
				uni.showToast({
					title: '注册成功',
					success: (res) => {
						setTimeout(()=> {
							uni.navigateTo({
								url: '/pages/login/login'
							})
						}, 1000)
					}
				})
			}
			else {
				uni.showToast({
					title: '注册失败'
				})
			}
		},
		backLogin() {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		}
	}
}
</script>
<style lang='scss' scoped>
	.registered {
		.title {
			padding: 0 50rpx;
			display: flex;
			align-items: center;
			margin-top: 80rpx;
			.iconfont {
				width: 50rpx;
				font-size: 50rpx;
				font-weight: bold;
				color: #aaa;
			}
			.title-name {
				flex: 1;
				text-align: center;
				font-size: 50rpx;
				font-weight: bold;
			}
			.title-placeholder {
				width: 50rpx;
			}
		}
		.main {
			margin-top: 30rpx;
			.login-input {
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
				input {
					width: 500rpx;
					height: 100rpx;
					border-bottom: 5rpx solid #EEEEEE;
					margin-top: 20rpx;
					font-size: 35rpx;
					padding: 0 20rpx;
					color: #333333;
				}
				/* 输入框默认值样式 */
				/deep/ .placeholder-class {
					font-size: 35rpx;
					color: #CCCCCC;
				}
				.code {
					position: relative;
					text {
						position: absolute;
						top: 50rpx;
						right: 10rpx;
						color: #1c6ae6;
						font-size: 32rpx;
					}
				}
			}
			.registered-button {
				margin-top: 80rpx;
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
		}
		
	}
</style>