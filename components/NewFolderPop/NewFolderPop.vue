<template>
  <view class='newfolderpop'>
		<ming-pop class="pops" ref="newfolderpop" direction="up" :is_close="false" :is_mask="true" :width="100">
			<view class="newfolder-header">
				<view class="channel" @click="popClose">取消</view>
				<view class="newfolder-title">新建文件夹</view>
				<view class="done" @click="done">完成</view>
			</view>
			<view class="newfolder-img">
				<image src="/static/img/folder.png" mode="heightFix"></image>
			</view>
			
			<view class="name-input">
				<input type="text" :value="name" @input="inputChange" />
				<text class="iconfont icon-close" @click="inputClear"></text>
			</view>
		</ming-pop>
	</view>
</template>

<script>
import {mapState} from 'vuex'
	
export default {
  name: 'newfolderpop',
  props: {
		currentDir: {
			type: String,
			required: true
		},
		currentDirId: {
			type: Number,
			required: true
		}
	},
  data() {
    return {
			name: '新建文件夹'
    };
  },
  computed: {
		...mapState(['userInfo'])
	},
  watch: {},
  created() {},
  methods: {
		// 输入内容发生改变 给name重新赋值
		inputChange(e) {
			this.name = e.detail.value
		},
		popshow() {
			this.$refs.newfolderpop.show();
		},
		popClose() {
			this.$refs.newfolderpop.close()
		},
		inputClear() {
			this.name = ""
		},
		async done() {
			const {data} = await this.$myRequest({
				url: `/educenter/dir/setUserDir/${this.userInfo.id}/${this.name}/${this.currentDirId}`,
				method: 'POST'
			})
			if(data.code === 20001) {
				this.$emit('newFolderFail')
			}
			else {
				this.$emit('newFolderDone')
			}
			this.popClose()
		}
	}
}
</script>
<style lang='scss' scoped>
.newfolderpop {
	/deep/ .product-window {
		z-index: 1001;
	}
	/deep/ .mask {
		z-index: 1000 !important;
	}
	.newfolder-header {
		display: flex;
		align-items: center;
		.channel {
			flex: 1;
			font-size: 28rpx;
			color: #666666;
		}
		.newfolder-title {
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
	.newfolder-img {
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