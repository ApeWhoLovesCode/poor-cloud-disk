<template>
  <view class='MyPop' v-if="userInfo">
		<ming-pop class="pops" ref="mypop" direction="left" :is_close="false" :is_mask="true" :width="80">
			<view class="user-info" @click="toUserInfo">
				<view class="user-avatar">
					<image v-if="userInfo.avatar" :src="userInfo.avatar" mode="aspectFill"></image>
					<text v-else>?</text>
				</view>
				<view class="user-name">{{userInfo.nickname}}</view>
			</view>
			<!-- 功能选项 -->
			<view class="features">
				<view class="features-box" @click="$emit('collectionClick')">
					<text class="iconfont icon-shoucang"></text>
					<text>收藏夹</text>
				</view>
				<view class="features-box" @click="Undeveloped">
					<text class="iconfont icon-ashbin"></text>
					<text>回收站</text>
				</view>
				<view class="features-box" @click="Undeveloped">
					<text class="iconfont icon-yijianfankui"></text>
					<text>意见和反馈</text>
				</view>
				<view class="features-box" @click="Undeveloped">
					<text class="iconfont icon-setting"></text>
					<text>设置</text>
				</view>
				<view class="features-box" @click="loginClick">
					<text class="iconfont icon-user"></text>
					<text>退出登录</text>
				</view>
			</view>
			<!-- 内存 -->
			<view class="memory">
				<view class="memory-content">{{$store.getters.fileSizeInfo}} / 1GB</view>
				<progress 
				:percent="percentage" 
				activeColor="#148dff" 
				border-radius="3" 
				:show-info="false" 
				active 
				backgroundColor="#e3e3e3"
				show-info
				/>
			</view>
		</ming-pop>
	</view>
</template>

<script>
import {mapState} from 'vuex'
import {removeItem} from '../../utils/storage.js'
	
export default {
  name: 'MyPop',
  props: {},
  data() {
    return {
			
    };
  },
  computed: {
		...mapState(['userInfo', 'fileSize']),
		// 百分比
		percentage() {
			return (this.userInfo.neicun / 1073741824 * 100).toFixed(2)
		}
	},
  watch: {},
  created() {
		// this.getAllFileInfo()
	},
  methods: {
		// 获取当前用户所有的文件
		async getAllFileInfo() {
			const {data} = await this.$myRequest({
				url: `/educenter/member/getMemberInfo/${this.userInfo.id}`
			})
			this.$store.commit('setUserInfo', data.data.member)
		},
		popshow() {
			this.$refs.mypop.show();
		},
		popclose() {
			this.$refs.mypop.close()
		},
		loginClick() {
			uni.showModal({
				title: '温馨提示',
				content: '您确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						// 清除用户登录信息
						this.$store.commit('setUserInfo', null)
						removeItem('token')
					  uni.navigateTo({
					  	url: '/pages/login/login'
					  });
					} else if (res.cancel) {
					  return
					}
				}
			})
			
		},
		// 跳转到用户信息页面
		toUserInfo() {
			uni.navigateTo({
				url: '/pages/userinfo/userinfo'
			})
		},
		// 功能未开发
		Undeveloped() {
			uni.showToast({
				title: '该功能尚未开发，敬请期待',
				icon: 'none',
				duration: 1000,
				position: 'top'
			})
		}
	},
}
</script>
<style lang='scss' scoped>
.pops {
	/deep/ .product-window {
		z-index: 999;
		border-radius: 80rpx;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		background-color: #f2f2f2;
	}
	
	.user-info {
		padding-left: 30rpx;
		.user-avatar {
			width: 100rpx;
			height: 100rpx;
			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
			text {
				display: inline-block;
				width: 100%;
				height: 100%;
				line-height: 100rpx;
				text-align: center;
				font-size: 45rpx;
				color: #aaa;
				border: 5rpx solid #CCCCCC;
				border-radius: 50%;
			}
		}
		.user-name {
			margin-top: 20rpx;
			font-size: 35rpx;
			font-weight: 600;
			color: #000;
		}
	}
	
	.features {
		padding-left: 20rpx;
		margin-top: 80rpx;
		.features-box {
			display: flex;
			align-items: center;
			margin-bottom: 40rpx;
			text {
				font-size: 32rpx;
				color: #222;
			}
			.iconfont {
				font-size: 40rpx;
				margin-right: 30rpx;
			}
		}
		.features-box:last-child {
			text {
				color: #f02d30;
			}
		}
	}
	
	.memory {
		width: 80%;
		position: absolute;
		bottom: 150rpx;
		left: 50rpx;
		.memory-content {
			font-size: 28rpx;
			color: #333333;
		}
	}
}
</style>