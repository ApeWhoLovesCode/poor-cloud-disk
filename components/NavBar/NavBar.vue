<template>
	<view :style="{paddingTop: systemBarHeight + 'px'}" class="nav-bar-wrap">
		<view v-if="!isSelect" class="nav-bar">
			<view class="nav-left" @click="$emit('clickAvatar')" >
				<image
				v-if="userInfo && userInfo.avatar"
				class="avatar" 
				:src="userInfo.avatar" 
				mode="aspectFill" 
				/>
				<text v-else>?</text>
			</view>
			<view class="nav-center">
				<view class="search-inp" @click="toSearch()"></view>
				<text class="iconfont icon-search"></text>
			</view>
			<view class="nav-right">
				<text :class="{'rotate': chuanshuRotate}" class="chuanshu iconfont icon-chuanshuliebiao" @click="chuanshuClick"></text>
				<text class="gongneng iconfont icon-elipsis" @click="$emit('gongnengClick')"></text>
			</view>
		</view>
		
		<view class="select-nav" v-else>
			<text class="select-nav-left" @click="$emit('allSelect')">全选</text>
			<text v-if="selectNum !== 0" class="select-nav-center">已选 {{selectNum}} 项</text>
			<text class="select-nav-right" @click="$emit('doneSelect')">完成</text>
		</view>
	</view>
</template>

<script>
import {mapState} from 'vuex'
	
export default {
	name: 'NavBar',
	props: {
		isSelect: {
			type: Boolean,
			default: false
		},
		selectNum: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			// 控制传输列表是否旋转
			chuanshuRotate: false
		};
	},
	computed: {
		...mapState(['systemBarHeight','userInfo','progress','downProgress']),
		isChuanshu() {
			return this.progress
		},
		isDownload() {
			return this.downProgress
		}
	},
	watch: {
		isChuanshu(val) {
			if(val > 0 && val < 100) {
				this.chuanshuRotate = true
			} else {
				this.chuanshuRotate = false
			}
		},
		isDownload(val) {
			if(val > 0 && val < 100) {
				this.chuanshuRotate = true
			} else {
				this.chuanshuRotate = false
			}
		}
	},
	methods: {
		toSearch() {
			uni.navigateTo({
				url: '/pages/search/search'
			});
		},
		chuanshuClick() {
			uni.navigateTo({
				url: '/pages/transmissionList/transmissionList'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.nav-bar-wrap {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	background-color: #FFFFFF;
	z-index: 1;
}
.nav-bar {
	// margin-top: 60rpx;
	display: flex;
	align-items: center;
	height: 90rpx;
	width: 100%;
	// border-bottom: 5rpx solid #f0f0f0;
}
.nav-left {
	flex: 1;
	text-align: center;
	.avatar {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
	}
	text {
		display: inline-block;
		width: 60rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 35rpx;
		color: #aaa;
		border: 1rpx solid #CCCCCC;
		border-radius: 50%;
	}
}
.nav-center {
	flex: 4;
	height: 100%;
	padding-left: 20rpx;
	padding-right: 30rpx;
	display: flex;
	align-items: center;
	position: relative;
	.search-inp {
		flex: 1;
		height: 55%;
		border: 5rpx solid #efefef;
		border-radius: 15rpx;
	}
	text {
		position: absolute;
		top: 27rpx;
		right: 60rpx;
		font-size: 32rpx;
		color: #6b6b6b;
	}
}
.nav-right {
	flex: 1.2;
	.chuanshu {
		display: inline-block;
		font-size: 28rpx;
		color: #a7a7a7;
		border: 2rpx solid #a7a7a7;
		border-radius: 50%;
		padding: 8rpx;
	}
	.gongneng {
		margin-left: 20rpx;
		font-size: 35rpx;
		color: #999999;
	}
	.rotate {
		border: 2rpx solid #8c9eff;
		color: #8c9eff;
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

.select-nav {
	display: flex;
	align-items: center;
	height: 90rpx;
	// height: 90rpx;
	padding: 0 30rpx;
	text {
		flex: 1;
	}
	.select-nav-left {
		font-size: 30rpx;
	}
	.select-nav-center {
		text-align: center;
		font-size: 33rpx;
		color: #000000;
	}
	.select-nav-right {
		text-align: right;
		color: #679ff9;
	}
}
</style>
