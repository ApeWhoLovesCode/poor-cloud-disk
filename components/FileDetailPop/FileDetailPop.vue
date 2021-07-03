<template>
  <view class='FileDetailPop'>
		<ming-pop class="pops" ref="filedetailpop" direction="below" :is_close="true" :is_mask="true" :width="100">
			<view class="title">详细信息</view>
			<view class="main">
				<view class="main-item">
					<view class="item-icon">
						<text class="iconfont icon-xinxi"></text>
					</view>
					<view class="item-info">
						<view class="item-name">{{fileObject.name}}</view>
						<view class="item-name-bottom">{{fileSize}}</view>
					</view>
				</view>
					
				<view class="main-item">
					<view class="item-icon">
						<text class="iconfont icon-xinxi"></text>
					</view>
					<view class="item-info">
						<view class="item-name">文件位置</view>
						<view class="item-name-bottom">{{fileDir}}</view>
					</view>
				</view>
					
				<view class="main-item">
					<view class="item-icon">
						<text class="iconfont icon-chart-pie"></text>
					</view>
					<view class="item-info">
						<view class="item-name">创建时间</view>
						<view class="item-name-bottom">
							{{fileObject.gmtCreate}}
						</view>
					</view>
				</view>
					
					<view class="main-item">
						<view class="item-icon">
							<text class="iconfont icon-edit"></text>
						</view>
					<view class="item-info">
						<view class="item-name">修改时间</view>
						<view class="item-name-bottom">
							{{fileObject.gmtModified}}
						</view>
					</view>
					
				</view>
			</view>
		</ming-pop>
	</view>
</template>

<script>
export default {
  name: 'FileDetailPop',
  props: {
		fileObject: {
			type: Object,
			default() {
				return {}
			}
		},
		currentDir: {
			type: String,
			default: "/root"
		}
	},
  data() {
    return {

    };
  },
  computed: {
		fileSize() {
			if(this.fileObject.size && this.fileObject.size < 1024) {
				return this.fileObject.size.toFixed(2) + 'Byte'
			} else if(this.fileObject.size < 1024 * 1024) {
				return (this.fileObject.size / 1024).toFixed(2) + 'KB'
			} else if(this.fileObject.size < 1024 * 1024 * 1024) {
				return (this.fileObject.size / 1024 / 1024).toFixed(2) + 'M'
			} else if(this.fileObject.size < 1024 * 1024 * 1024 * 1024) {
				return (this.fileObject.size / 1024 / 1024 / 1024).toFixed(2) + 'G'
			} else {
				return '文件大小无法识别'
			}
		},
		fileDir() {
			if(!this.fileObject.fdir) {
				return
			}
			else if(this.fileObject.fdir === '/root') {
				return '根目录'
			} else {
				let str = this.fileObject.fdir.substring(5, this.fileObject.fdir.length)
				// str.replace("/","->")只会替换第一个匹配的字符.(g为全局标志)
				return '根目录' + str.replace(/\//g, " -> ")
			}
		}
	},
  watch: {},
  created() {},
  methods: {
		popshow() {
			this.$refs.filedetailpop.show()
		}
	}
}
</script>
<style lang='scss' scoped>
	.pops {
		/deep/ .product-window {
				z-index: 999;
			}
	}
	.title {
		font-size: 28rpx;
		color: #888;
	}
	.main {
		margin-bottom: 200rpx;
		margin-top: 30rpx;
		.main-item {
			display: flex;
			padding: 15rpx 0;
			/* height: 120rpx; */
			align-items: center;
			.item-icon {
				flex: 1;
				.iconfont {
					font-size: 42rpx;
					color: #000;
				}
			}
			.item-info {
				flex: 9;
				.item-name {
					width: 600rpx;
					font-size: 30rpx;
					color: #333333;
					word-break: break-all;
				}
				.item-name-bottom {
					margin-top: 5rpx;
					font-size: 26rpx;
					color: #999;
				}
			}
		}
	}
</style>