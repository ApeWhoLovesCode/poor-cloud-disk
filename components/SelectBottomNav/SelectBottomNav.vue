<template>
  <view 
	class="bottom-nav" 
	:class="(isSelect && selectNum !== 0) ? 'move-b-nav-out' : 'move-b-nav-hidden'">
  	<view class="bottom-nav-item">
  		<view class="iconfont icon-bottom"></view>
  		<view>下载</view>
  	</view>
  	<view class="bottom-nav-item">
			<view v-if="isCollect" @click="$emit('cancelFavoritesClick', 'many')">
				<view class="iconfont icon-favorite"></view>
				<view>取消收藏</view>
			</view>
			<view v-else @click="$emit('favoritesClick', 'many')">
				<view class="iconfont icon-favorite"></view>
				<view>收藏</view>
			</view>
  		
  	</view>
  	<view class="bottom-nav-item" v-if="!isCollection">
  		<view class="iconfont icon-yidong" @click="$emit('moveFile')"></view>
  		<view>移动</view>
  	</view>
  	<view class="bottom-nav-item delete" @click="$emit('deleteCollect')">
  		<view class="iconfont icon-ashbin"></view>
  		<view>删除</view>
  	</view>
  </view>
</template>

<script>
export default {
  name: '',
  props: {
		isSelect: {
			type: Boolean,
			default: false
		},
		selectNum: {
			type: Number,
			default: 0
		},
		isCollect: {
			type: Boolean,
			default: true
		},
		isCollection: {
			type: Number,
			default: 0
		}
	},
  data() {
    return {

    };
  },
  computed: {},
  created() {},
  methods: {}
}
</script>
<style lang='scss' scoped>
.bottom-nav {
	z-index: 999;
	position: fixed;
	bottom: -150rpx;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	height: 150rpx;
	background-color: #FFFFFF;
	border-top: 1rpx solid #e1e1e1;
	.bottom-nav-item {
		flex: 1;
		text-align: center;
		view {
			font-size: 28rpx;
			color: #333333;
		}
		.iconfont {
			font-size: 48rpx;
			color: #333333;
			margin-bottom: 5rpx;
		}
	}
	.delete {
		view {
			color: #ff0000;
		}
		.iconfont {
			color: #ff0000;
		}
	}
}

/* 移动动画 */
.move-b-nav-out {
	transform: translateY(-150rpx);
	transition: all 0.5s;
}
.move-b-nav-hidden {
	transform: translateY(0);
	transition: all 0.5s;
}
</style>