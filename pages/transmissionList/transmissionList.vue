v
<template>
	<view class="transmissionList" :style="{marginTop: systemBarHeight + 'px'}">
		<view class="nav">
			<view class="nav-left">
				<text class="iconfont icon-arrow-left-bold" @click="back"></text>
			</view>
			<view class="nav-center"><text>传输列表</text></view>
			<view class="nav-right"></view>
		</view>
		<view class="upload-progress">
			<view class="title-wrap" @click="upOrDown = 'up'">
				<text :class="{'current' : upOrDown === 'up'}"  class="title">上传进度</text>
				<text :class="{'isload' : upload }" class="iconfont icon-refresh"></text>
			</view>
			<view class="title-wrap" @click="upOrDown = 'down'">
				<text :class="{'current' : upOrDown === 'down'}" class="title">文件下载</text>
				<text :class="{'isload' : download }" class="iconfont icon-refresh"></text>
			</view>
		</view>
		<view class="transmission-wrap" v-if="upOrDown === 'up'">
			<view class="t-item" v-if="progress && progress !== 100">
				<view class="t-item-top">
					<view class="item-img">
						<image v-if="transmissionImg" :src="transmissionImg" mode="aspectFill"></image>
						<image v-else src="/static/img/upload.png" mode="aspectFill"></image>
					</view>
					<view class="item-title">
						<view class="t-progress">
							<text>{{ fileSize(nowProgress) }}</text>
							/
							<text>{{ fileSize(totalProgress) }}</text>
						</view>
					</view>
				</view>
				<progress :percent="progress" stroke-width="3" />
			</view>
			<view class="t-item-null" v-else>
				<image src="/static/img/noloadtask.png" mode="widthFix"></image>
				<view>当前没有上传任务</view>
			</view>
		</view>

		<view class="transmission-wrap" v-if="upOrDown === 'down'">
			<view class="t-item" v-if="downProgress && downProgress !== 100">
				<view class="t-item-top">
					<view class="item-img">
						<image class="down-img" src="/static/img/download.png" mode="heightFix"></image>
					</view>
					<view class="item-title">
						<view class="t-progress">
							<text>{{ fileSize(downNowProgress) }}</text>
							/
							<text>{{ fileSize(downTotalProgress) }}</text>
						</view>
					</view>
				</view>
				<progress :percent="downProgress" stroke-width="3" />
			</view>
			<view class="t-item-null" v-else>
				<image src="/static/img/noloadtask.png" mode="widthFix"></image>
				<view>当前没有下载任务</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'transmissionList',
	props: {},
	data() {
		return {
			upOrDown: 'up',
			upload: false,
			download: false
		};
	},
	computed: {
		// 映射 vuex 中的 userInfo
		...mapState(['systemBarHeight','progress', 'nowProgress', 'totalProgress', 'transmissionImg', 
		'downProgress', 'downNowProgress', 'downTotalProgress']),
		// 监听 vuex 的 progress
		clearProgress() {
			return this.progress;
		},
		clearDownProgress() {
			return this.downProgress;
		}
	},
	watch: {
		// 如果上传进度到 100 就清空进度
		clearProgress(val) {
			if (val === 100) {
				this.upload = false
				this.$store.commit('setProgress', 0);
				this.$store.commit('setNowProgress', 0);
				this.$store.commit('setTotalProgress', 0);
				this.$store.commit('setTransmissionImg', '')
			} else if (val === 0) {
				this.upload = false
			}
			else {
				this.upload = true
			}
		},
		clearDownProgress(val) {
			if (val === 100) {
				this.download = false
				this.$store.commit('setDownProgress', 0);
				this.$store.commit('setDownNowProgress', 0);
				this.$store.commit('setDownTotalProgress', 0);
			} else if (val === 0) {
				this.upload = false
			} else {
				this.download = true
			}
		}
	},
	created() {},
	methods: {
		back() {
			uni.switchTab({
				url: '/pages/file/file'
			});
		},
		fileSize(size) {
			if (size < 1024) {
				return size.toFixed(2) + 'Byte';
			} else if (size < 1024 * 1024) {
				return (size / 1024).toFixed(2) + 'KB';
			} else if (size < 1024 * 1024 * 1024) {
				return (size / 1024 / 1024).toFixed(2) + 'M';
			} else if (size < 1024 * 1024 * 1024 * 1024) {
				return (size / 1024 / 1024 / 1024).toFixed(2) + 'G';
			} else {
				return '文件大小无法识别';
			}
		}
	}
};
</script>
<style lang="scss" scoped>
.nav {
	display: flex;
	align-items: center;
	height: 100rpx;
	padding: 0 30rpx;
	.nav-left {
		display: inline-block;
		flex: 1;
		.iconfont {
			font-size: 45rpx;
			color: #333333;
		}
	}
	.nav-center {
		flex: 6;
		text-align: center;
		font-size: 35rpx;
		color: #000;
		font-weight: bold;
	}
	.nav-right {
		flex: 1;
	}
}

.upload-progress {
	display: flex;
	justify-content: space-between;
	padding: 50rpx 160rpx 20rpx;
	.title {
		display: inline-block;
		font-size: 28rpx;
		color: #333333;
		font-weight: bold;
		padding: 10rpx 15rpx;
		border-bottom: 5rpx solid #FFFFFF;
		transition: border-bottom .4s ease-out, opacity 0.2s ease-in, visibility 0.2s ease-in;
	}
	.current {
		border-bottom: 5rpx solid #007AFF;
	}
	.iconfont {
		display: none;
		margin-left: 10rpx;
		font-size: 32rpx;
		color: #007AFF;
	}
	.isload {
		display: inline-block;
		animation: rotating 2s linear infinite;
	}
}

@keyframes rotating {
	0% {
		transform: rotate(0);
	}
	100% {
		transform: rotate(360deg);
	}
}

.transmission-wrap {
	margin-top: 10rpx;
	.t-item {
		background: #f7f7f7;
		padding: 20rpx 30rpx;
		height: 130rpx;
		.t-item-top {
			display: flex;
			.item-img {
				width: 100rpx;
				height: 100rpx;
				image {
					width: 100%;
					height: 100%;
					border-radius: 20rpx;
				}
				.down-img {
					width: 60%;
					height: 60%;
					margin-left: 50%;
					margin-top: 50%;
					transform: translate(-50%, -50%);
					border-radius: 0;
				}
			}
			.item-title {
				margin-top: 50rpx;
				margin-left: 20rpx;
				.t-progress {
					font-size: 28rpx;
					color: #888;
					text {
						margin: 0 10rpx;
					}
				}
			}
		}
	}
	
	.t-item-null {
		margin-top: 50rpx;
		width: 100%;
		text-align: center;
		image {
			width: 60%;
		}
		view {
			font-size: 35rpx;
			color: #000000;
		}
	}
}
</style>
