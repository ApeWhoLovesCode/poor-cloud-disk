<template>
  <view 
	class='CollectionItem' 
	:class="(fileItem.checked && fileItem.filetype !== 'folder') ? 'item-select' : ''" 
	@click="fileItemClick"
	>
		<view class="item-img" v-if="fileItem.filetype === 'file'">
			<image src="/static/img/document4.png" mode="aspectFill"></image>
		</view>
		<view class="item-img" v-else-if="fileItem.filetype === 'audio'">
			<image src="/static/img/music.png" mode="aspectFill"></image>
		</view>
		<view class="item-img" v-else-if="fileItem.filetype === 'image'">
			<image :src="fileItem.url" mode="aspectFill"></image>
		</view>
		<view class="item-img" v-else-if="fileItem.filetype === 'video'">
			<!-- <video
			:src="videoUrl" 
			:controls="false"
			:show-center-play-btn="false"
			></video> -->
			<image class="video-img" src="/static/img/video3.png" mode="heightFix"></image>
		</view>
		<view class="item-img" v-else>
			<image src="/static/img/folder.png" mode="aspectFill"></image>
		</view>
		<view class="item-content">
			<view class="item-title">{{fileItem.name}}</view>
			<view class="item-title-bottom">
				<text>{{fileItem.gmtCreate}}</text>
			</view>
		</view>
		<view class="item-content-right">
			<view v-if="!isSelect" class="item-edit" @click.stop="$emit('detailClick', fileItem)">
				<text class="iconfont icon-elipsis"></text>
			</view>
			<view v-if="isSelect && fileItem.filetype !== 'folder'" class="select-btn">
				<text class="iconfont icon-select" :class="fileItem.checked ? 'btn-selected' : ''"></text>
			</view>
			<!-- 是否处于收藏状态 -->
			<view class="collect-status" v-if="!isCollection && fileItem.collection">
				<image src="/static/img/collect4.png" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script>
export default {
  name: 'CollectionItem',
  props: {
		fileItem: {
			type: Object,
			required: true
		},
		isSelect: {
			type: Boolean,
			default: false
		},
		// 视频播放地址
		videoList: {
			type: Array,
			default() {
				return []
			}
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
  computed: {
		videoUrl() {
			if(this.videoList.length !== 0 && this.fileItem.filetype === 'video') {
				let arr = this.videoList.find((item) => item.videoId === this.fileItem.videoId)
				if(arr) {
					return arr.url
				}
			}
		}
	},
  watch: {},
  created() {},
  methods: {
		fileItemClick() {
			if(!this.isSelect) {
				this.$emit('fileItemClick', this.fileItem)
			} else {
				// 原方法
				this.fileItem.checked = !this.fileItem.checked
				// 解决小程序不能修改props属性的笨方法
				// this.$emit('selectFileitemClick', this.fileItem.id)
			}
		}
	}
}
</script>
<style lang='scss' scoped>
.item-select {
	background: linear-gradient(to bottom, #d9eeff, #ffffff, #d9eeff);
}
.CollectionItem {
	display: flex;
	align-items: center;
	height: 130rpx;
	margin-top: 20rpx;
	border-radius: 20rpx;
	overflow: hidden; 
	.item-img {
		width: 100rpx;
		height: 100rpx;
		border-radius: 25rpx;
		overflow: hidden;
		image {
			width: 100%;
			height: 100%;
		}
		.video-img {
			width: 60%;
			height: 60%;
			margin-left: 50%;
			margin-top: 50%;
			transform: translate(-50%, -50%);
		}
		video {
			width: 100%;
			height: 100%;
		}
	}
	.item-content {
		width: 450rpx;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding: 0 30rpx;
		.item-title {
			width: 100%;
			font-size: 30rpx;
			color: #333333;
			/* 溢出一行显示 */
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		.item-title-bottom {
			font-size: 26rpx;
			color: #999999;
		}
	}
	.item-content-right {
		position: relative;
		.collect-status {
			position: absolute;
			left: -50rpx;
			top: 30rpx;
			width: 40rpx;
			height: 40rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
	.item-edit {
		width: 60rpx;
		line-height: 100rpx;
		.iconfont {
			width: 100%;
			background-color: #EEEEEE;
			padding: 0 12rpx;
			border-radius: 10rpx;
			font-size: 35rpx;
			font-weight: bold;
			color: #666;
		}
	}
	.select-btn {
		width: 60rpx;
		line-height: 100rpx;
		.iconfont {
			box-sizing: border-box;
			padding: 6rpx;
			border: 1rpx solid #CCCCCC;
			border-radius: 50%;
			color: #FFFFFF;
			font-size: 32rpx;
			font-weight: bold;
		}
		.btn-selected {
			background-color: #679ff9;
			border: 0;
		}
	}
}
</style>