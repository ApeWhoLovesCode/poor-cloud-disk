<template>
	<view class="rename" v-if="renameFile">
		<ming-pop class="pops" ref="renamepop" direction="up" :is_close="false" :is_mask="true" :width="100">
			<view class="rename-header"  :style="{marginTop: systemBarHeight + 'px'}">
				<view class="channel" @click="popClose">取消</view>
				<view class="rename-title">重命名</view>
				<view class="done" @click="done">完成</view>
			</view>
			<view class="rename-img" v-if="renameFile.filetype === 'file'">
				<image src="/static/img/document4.png" mode="heightFix"></image>
			</view>
			<view class="rename-img" v-else-if="renameFile.filetype === 'image'">
				<image :src="renameFile.url" mode="heightFix"></image>
			</view>
			<view class="rename-img" v-else-if="renameFile.filetype === 'audio'">
				<image src="/static/img/music.png" mode="heightFix"></image>
			</view>
			<view class="rename-img" v-else-if="renameFile.filetype === 'video'">
				<!-- <video
				:src="videoUrl" 
				:controls="false"
				:show-center-play-btn="false"
				></video> -->
				<image class="video-img" src="/static/img/video3.png" mode="heightFix"></image>
			</view>
			<view class="rename-img" v-else>
				<image src="/static/img/folder.png" mode="heightFix"></image>
			</view>
			<view class="name-input">
				<input type="text" :focus="showFocus" :value="renameFile.name" @input="inputChange" />
				<text class="iconfont icon-close" @click="inputClear"></text>
			</view>
		</ming-pop>
	</view>
</template>

<script>
import {mapState} from 'vuex'
export default {
	name: 'rename',
	props: {
		renameFile: {
			type: Object,
			required: true
		},
		videoList: {
			type: Array,
			default() {
				return []
			}
		}
	},
	data() {
		return {
			name: "",
			showFocus: false
		};
	},
	computed: {
		...mapState(['systemBarHeight']),
		videoUrl() {
			if(this.videoList.length !== 0 && this.renameFile.filetype === 'video') {
				let arr = this.videoList.find((item) => item.videoId === this.renameFile.videoId)
				if(arr) {
					return arr.url
				}
				
			}
		}
	},
	watch: {},
	methods: {
		// 输入内容发生改变 给name重新赋值
		inputChange(e) {
			this.renameFile.name = e.detail.value
		},
		popshow() {
			this.$refs.renamepop.show();
			this.showFocus = true
		},
		popClose() {
			this.$refs.renamepop.close()
			this.showFocus = false
		},
		inputClear() {
			this.renameFile.name = ""
		},
		done() {
			this.popClose()
			// this.$emit('done', this.renameFile.id, this.renameFile.name)
			this.$emit('done', this.renameFile)
		}
	}
};
</script>
<style lang="scss" scoped>
.rename {
	/deep/ .product-window {
		z-index: 999;
	}
	.rename-header {
		display: flex;
		align-items: center;
		.channel {
			flex: 1;
			font-size: 28rpx;
			color: #666666;
		}
		.rename-title {
			flex: 6;
			font-size: 32rpx;
			color: #000000;
			font-weight: 600;
			text-align: center;
		}
		.done {
			flex: 1;
			font-size: 30rpx;
			color: #8c9eff;
		}
	}
	.rename-img {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 200rpx;
		margin-top: 80rpx;
		margin-bottom: 60rpx;
		image {
			height: 100%;
		}
		video {
			height: 100%;
		}
	}
	.name-input {
		position: relative;
		display: flex;
		justify-content: center;
		input {
			box-sizing: border-box;
			width: 620rpx;
			height: 80rpx;
			background-color: #e9e9e9;
			color: #333333;
			border: 1rpx solid #dadada;
			border-radius: 20rpx;
			text-align: center;
			font-size: 30rpx;
			padding: 0 30rpx;
		}
		.iconfont {
			position: absolute;
			right: 60rpx;
			top: 25rpx;
			font-size: 26rpx;
			background-color: #a3a3a3;
			color: #FFFFFF;
			border-radius: 50%;
			padding: 5rpx;
		}
	}
}
</style>
