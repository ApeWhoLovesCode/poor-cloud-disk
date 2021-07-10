<template>
	<view class="file-item">
		<view class="file-item-wrap" @click="fileItemClick">
			<!-- 文件夹图片 -->
			<view class="file-img" v-if="fileItem.filetype === 'file'">
				<image src="/static/img/document4.png" mode="heightFix" />
			</view>
			<!-- 音乐图片 -->
			<view class="file-img" v-else-if="fileItem.filetype === 'audio'">
				<image src="/static/img/music.png" mode="heightFix" />
			</view>
			<!-- 正常图片 -->
			<view class="file-img" v-else-if="fileItem.filetype === 'image'">
				<image :src="fileItem.url" mode="heightFix" />
			</view>
			<!-- 视频图片 -->
			<view class="file-img" v-else-if="fileItem.filetype === 'video'">
				<!-- <video 
				:src="videoUrl" 
				:controls="false"
				:show-center-play-btn="false"
				></video> -->
				<image class="video-img" src="/static/img/video3.png" mode="heightFix"></image>
			</view>
			<view class="file-img else-img" v-else>
				<image src="/static/img/folder.png" mode="heightFix" />
			</view>
			<view class="file-name">{{fileItem.name}}</view>
			<view class="file-time">{{fileItem.gmtCreate}}</view>
			
		</view>
		<!-- 文件的操作 -->
		<!-- :class="fileItem.checked ? 'selected' : ''" -->
		<view class="folder-operating">
			<text
			v-if="isSelect && fileItem.filetype !== 'folder'" 
			class="file-select iconfont icon-select" 
			:class="{'selected': fileItem.checked}"
			@click="fileItemClick"
			></text>
			<text v-if="!isSelect" class="file-detail iconfont icon-elipsis" @click="$emit('detailClick', fileItem)"></text>
			<text v-else class="folder-placeholder"></text>
			<!-- 是否处于收藏状态 -->
			<view class="collect-status" v-if="fileItem.collection">
				<image src="/static/img/collect4.png" mode="aspectFill"></image>
			</view>
		</view>
		
	</view>
</template>

<script>
export default {
	name: '',
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
	created() {
	},
	methods: {
		fileItemClick() {
			if(!this.isSelect) {
				this.$emit('fileItemClick', this.fileItem)
			} else {
				if(this.fileItem.filetype !== 'folder') {
					// 原方法
					this.fileItem.checked = !this.fileItem.checked
					// 解决小程序不能修改props属性的笨方法
					// this.$emit('selectFileitemClick', this.fileItem.id)
				}
			}
		}
		
	}
};
</script>
<style lang="scss" scoped>
	.background{
		background-color: #007AFF;
	}
	.file-item {
		text-align: center;
		.file-img {
			overflow: hidden;
			height: 130rpx;
			margin: 0 auto;
			image {
				height: 100%;
			}
			.video-img {
				margin-top: 20rpx;
				height: 75%;
			}
			video {
				width: 100%;
				height: 100%;
			}
		}
		.else-img {
			margin-top: 30rpx;
		}
		.file-name {
			margin-top: 20rpx;
			font-size: 26rpx;
			color: #333333;
			/* 溢出一行显示 */
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		.file-time {
			font-size: 24rpx;
			color: #bbb;
			/* 溢出一行显示 */
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		.folder-operating {
			position: relative;
		}
		.file-detail {
			display: inline-block;
			margin-top: 20rpx;
			font-size: 32rpx;
			font-weight: 600;
			padding: 2rpx 10rpx;
			color: #333333;
			background-color: #F1F1F1;
			border-radius: 10rpx;
		}
		.file-select {
			display: inline-block;
			margin-top: 12rpx;
			font-size: 28rpx;
			font-weight: 600;
			padding: 5rpx 6rpx;
			color: #FFFFFF;
			border: 5rpx solid #CCCCCC;
			border-radius: 50%;
		}
		.folder-placeholder {
			display: inline-block;
			height: 50rpx;
		}
		.selected {
			background-color: #679ff9;
			border: 5rpx solid #679ff9;
		}
	}
	.folder-bottom {
		padding-top: 30rpx;
		.iconfont {
			padding: 10rpx;
			font-size: 40rpx;
			color: #333;
			background-color: #f1f1f1;
		}
	}
	.collect-status {
		position: absolute;
		right: 25rpx;
		top: 15rpx;
		width: 40rpx;
		height: 40rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
</style>
