<template>
  <view class='NavGongnengPop'>
		<ming-pop class="pops" ref="navgongnengpop" direction="below" :is_close="true" :is_mask="true" :width="100">
			<view class="views">
				<view class="title">视图</view>
				<view class="views-btn">
					<view class="iconfont icon-elipsis" :class="!rowDisplay ? 'select-btn' : ''" @click="notRowDisplay"></view>
					<view class="iconfont icon-menu" :class="!rowDisplay ? '' : 'select-btn'" @click="RowDisplay"></view>
				</view>
			</view>
			<view class="sort">
				<view class="title">排序</view>
				<view class="sort-main" v-for="(item, index) in sortContent" :key="index">
					<view class="sort-item" @click="sortClick(item)">
						<text>{{item}}</text>
						<text 
						class="iconfont" 
						:class="[{'icon-arrow-up-bold':sortMode === item}, riseSort ? 'reverseSpin' : 'spin']"
						></text>
					</view>
					
				</view>
			</view>
			<view class="slect-file" @click="selectFile">
				<view class="title">选择文件</view>
				<view class="iconfont icon-success"></view>
			</view>
		</ming-pop>
	</view>
</template>

<script>
export default {
  name: 'NavGongnengPop',
  props: {
		rowDisplay: {
			type: Boolean,
			required: true
		}
	},
  data() {
    return {
			// 排序的内容
			sortContent: ['名称', '创建时间', '修改日期', '文件大小'],
			// 当前选择的排序方式是
			sortMode: '创建时间',
			// 升序
			riseSort: true
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
		sortClick(item) {
			// 如果该类型已经点击过了，就反向排序
			if(item === this.sortMode) {
				this.$emit('reverseSort')
				this.riseSort = !this.riseSort
				return
			}
			this.riseSort = true
			this.sortMode = item
			if(item === '名称') {
				this.$emit('nameSort')
			} else if(item === '创建时间') {
				this.$emit('creatTimeSort')
			} else if(item === '修改日期') {
				this.$emit('updateTimeSort')
			} else if(item === '文件大小') {
				this.$emit('sizeSort')
			}
		},
		popshow() {
			this.$refs.navgongnengpop.show()
		},
		popclose() {
			this.$refs.navgongnengpop.close()
		},
		selectFile() {
			this.popclose()
			this.$emit('selectFile')
		},
		notRowDisplay() {
			// vm.$emit('update:父组件属性', 值) 子组件修改父组件的值
			// 父组件 要修改的属性之后加入 .sync
			this.$emit('update:rowDisplay', false)
			this.popclose()
		},
		RowDisplay() {
			this.$emit('update:rowDisplay', true)
			this.popclose()
		}
	}
}
</script>
<style lang='scss' scoped>
.pops {
	/deep/ .product-window {
		z-index: 999;
	}
	.views {
		.title {
			font-size: 28rpx;
			color: #666;
			margin-bottom: 20rpx;
		}
		.views-btn {
			display: flex;
			align-items: center;
			height: 90rpx;
			background: #f7f7f7;
			border-radius: 15rpx;
			padding: 0 5rpx;
			.iconfont {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 85%;
				font-size: 50rpx;
				color: #333333;
				text-align: center;
			}
			.select-btn {
				background-color: #FFFFFF;
			}
		}
	}
	
	.sort {
		margin-top: 50rpx;
		.title {
			font-size: 28rpx;
			color: #666;
			margin-bottom: 20rpx;
		}
		.sort-main {
			background-color: #f7f7f7;
			border-radius: 20rpx;
		}
		.sort-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1rpx solid #eeeeee;
			padding: 30rpx 40rpx;
			text {
				font-size: 32rpx;
				color: #000;
			}
		}
		.sort-item:last-child {
			border-bottom: none;
		}
		/* 旋转 */
		.spin {
			animation: around 0.5s forwards;
		}
		.reverseSpin {
			animation: reverseAround 0.5s forwards;
		}
	}
	@keyframes around{
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(180deg);
		}
	}
	@keyframes reverseAround{
		0% {
			transform: rotate(180deg);
		}
		100% {
			transform: rotate(0deg);
		}
	}
	
	.slect-file {
		display: flex;
		justify-content: space-between;
		margin-top: 50rpx;
		background-color: #f7f7f7;
		border-radius: 20rpx;
		padding: 30rpx 40rpx;
		.title {
			font-size: 32rpx;
			color: #000;
		}
		.iconfont {
			font-size: 40rpx;
			color: #000;
		}
	}
}
</style>