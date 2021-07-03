<template>
	<view class="FilePop">
		<ming-pop class="pops" ref="filepop" direction="below" :is_close="true" :is_mask="true" :width="100">
			<view class="pop-head">
				<view class="h-img" v-if="fileObject.filetype === 'file'">
					<image src="/static/img/document4.png" mode="aspectFill" />
				</view>
				<view class="h-img" v-else-if="fileObject.filetype === 'image'">
					<image :src="fileObject.url" mode="aspectFill" />
				</view>
				<view class="h-img" v-else-if="fileObject.filetype === 'audio'">
					<image src="/static/img/music.png" mode="aspectFill" />
				</view>
				<view class="h-img" v-else-if="fileObject.filetype === 'video'">
					<!-- <video
					:src="videoUrl" 
					:controls="false"
					:show-center-play-btn="false"
					></video> -->
					<image class="video-img" src="/static/img/video3.png" mode="heightFix"></image>
				</view>
				<view class="h-img" v-else>
					<image src="/static/img/folder.png" mode="aspectFill" />
				</view>
				
				<view class="h-title">
					<view class="h-title-text">{{fileObject.name}}</view>
					<view class="h-title-time">{{fileObject.gmtCreate}}</view>
				</view>
			</view>
			<view class="pop-main">
				<view class="gongneng">
					<view v-if="fileObject.filetype !== 'folder'" class="share gongneng-box" @click="$emit('shareClick', fileObject)">
						<text class="iconfont icon-fenxiang"></text>
						<text>分享</text>
					</view>
					<view v-if="fileObject.filetype !== 'folder' && fileObject.collection === 0" class="favorites gongneng-box" @click="$emit('favoritesClick', fileObject.id)">
						<text class="iconfont icon-favorite"></text>
						<text>收藏</text>
					</view>
					<view v-if="fileObject.filetype !== 'folder' && fileObject.collection === 1" class="cancelfavorites gongneng-box" @click="$emit('cancelFavoritesClick', fileObject.id)">
						<text class="iconfont icon-quxiaoshoucang_huaban1"></text>
						<text>取消收藏</text>
					</view>
					<view class="rename gongneng-box" @click="$emit('renameClick', fileObject)">
						<text class="iconfont icon-mobile-phone"></text>
						<text>重命名</text>
					</view>
				</view>
				<view class="gongneng-two" v-if="fileObject.filetype !== 'folder'">
					<view class="gongneng-two-box" @click="$emit('downloadFile', fileObject)">
						<text>下载文件</text>
						<text class="iconfont icon-bottom"></text>
					</view>
					<view class="gongneng-two-box" @click="Undeveloped">
						<text>用其他应用打开</text>
						<text class="iconfont icon-share"></text>
					</view>
				</view>
				<view class="info-content" v-if="fileObject.filetype !== 'folder'">
					<view class="gongneng-two-box" @click="$emit('detailsClick')">
						<text>查看详细信息</text>
						<text class="iconfont icon-xinxi"></text>
					</view>
					<view class="gongneng-two-box" @click="$emit('moveClick',fileObject.id)">
						<text>移动</text>
						<text class="iconfont icon-yidong"></text>
					</view>
					<view v-if="parentType === 'all'" class="gongneng-two-box" @click="$emit('selectFileClick',fileObject.id)">
						<text>选择文件</text>
						<text class="iconfont icon-success"></text>
					</view>
				</view>
				<view class="delete" @click="$emit('deletefile',fileObject)">
					<text>删除</text>
					<text class="iconfont icon-ashbin"></text>
				</view>
			</view>
			<!-- 文件夹的蒙版，用于点击了其他功能 -->
			<!-- <view class="folder-toast2" v-if="fileObject.filetype === 'folder'" @click="Undeveloped"></view> -->
			<!-- <view class="folder-toast" v-if="fileObject.filetype === 'folder'" @click="Undeveloped"></view> -->
		</ming-pop>
	</view>
</template>

<script>
export default {
	name: 'FilePop',
	props: {
		fileObject: {
			type: Object,
			required: true
		},
		videoList: {
			type: Array,
			default() {
				return []
			}
		},
		parentType: {
			type: String,
			default: 'all'
		}
	},
	data() {
		return {};
	},
	computed: {
		videoUrl() {
			if(this.videoList.length !== 0 && this.fileObject.filetype === 'video') {
				let arr = this.videoList.find((item) => item.videoId === this.fileObject.videoId)
				if(arr) {
					return arr.url
				}
			}
		}
	},
	watch: {},
	created() {},
	methods: {
		popshow() {
			this.$refs.filepop.show();
		},
		popclose() {
			this.$refs.filepop.close()
		},
		// 功能未开发
		Undeveloped() {
			uni.showToast({
				title: '暂无该功能，敬请期待',
				icon: 'none',
				duration: 1500,
				position: 'top'
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.pops {
	position: relative;
	/deep/ .product-window {
		z-index: 999;
	}
	/* 文件夹蒙版 */
	.folder-toast {
		position: absolute;
		top: 400rpx;
		left: 30rpx;
		right: 30rpx;
		bottom: 170rpx;
		// background-color: rgba(0, 0, 0, .3);
	}
	.folder-toast2 {
		position: absolute;
		top: 200rpx;
		left: 30rpx;
		right: 250rpx;
		height: 170rpx;
	}
	/* 文件夹蒙版end */
	.pop-head {
		display: flex;
		height: 100rpx;
		padding: 10rpx;
		border-bottom: 5rpx solid #eee;
		.h-img {
			flex: 1;
			image {
				width: 90rpx;
				height: 90rpx;
				border-radius: 10rpx;
				overflow: hidden;
			}
			video {
				width: 90rpx;
				height: 90rpx;
			}
		}
		.h-title {
			flex: 7;
			padding: 0 30rpx;
			.h-title-text {
				width: 500rpx;
				margin-top: 10rpx;
				font-size: 28rpx;
				color: #333333;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
			.h-title-time {
				font-size: 24rpx;
				color: #aaa;
			}
		}
	}
	.pop-main {
		.gongneng {
			display: flex;
			margin-top: 30rpx;
			.gongneng-box {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				height: 160rpx;
				margin-right: 20rpx;
				background-color: #f3f3f3;
				border-radius: 20rpx;
				font-size: 28rpx;
				color: #333333;
				.iconfont {
					font-size: 38rpx;
					margin-bottom: 5rpx;
				}
			}
			.rename{
				margin-right: 0;
			}
			.cancelfavorites {
				color: #aaa;
			}
		}
		
		.gongneng-two {
			margin-top: 35rpx;
			border-radius: 20rpx;
			overflow: hidden;
			.gongneng-two-box {
				display: flex;
				justify-content: space-between;
				padding: 30rpx 40rpx;
				background-color: #f3f3f3;
				border-bottom: 2rpx solid #e6e6e6;
				text {
					font-size: 28rpx;
					color: #000;
				}
				.iconfont {
					font-size: 35rpx;
				}
			}
			.gongneng-two-box:last-child {
				border-bottom: 0;
			}
		}
	
		.info-content {
			margin-top: 35rpx;
			border-radius: 20rpx;
			overflow: hidden;
			.gongneng-two-box {
				display: flex;
				justify-content: space-between;
				padding: 30rpx 40rpx;
				background-color: #f3f3f3;
				border-bottom: 2rpx solid #e6e6e6;
				text {
					font-size: 28rpx;
					color: #000;
				}
				.iconfont {
					font-size: 35rpx;
				}
			}
			.gongneng-two-box:last-child {
				border-bottom: 0;
			}
		}
	
		.delete {
			margin-top: 30rpx;
			border-radius: 20rpx;
			overflow: hidden;
			display: flex;
			justify-content: space-between;
			padding: 30rpx 40rpx;
			background-color: #f3f3f3;
			text {
				font-size: 28rpx;
				color: #e55457;
			}
			.iconfont {
				font-size: 35rpx;
			}
		}
	}
}
</style>
