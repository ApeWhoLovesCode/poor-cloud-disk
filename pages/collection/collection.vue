<template>
  <view class='collection' :style="{marginTop: systemBarHeight + 'px'}">
		<view class="nav">
			<view class="nav-left">
				<text v-if="!isSelect" class="iconfont icon-arrow-left-bold" @click="back"></text>
				<text v-else class="iconfont icon-close" @click="cancelSelect"></text>
			</view>
			<view class="nav-center">
				<text v-if="!isSelect">收藏夹</text>
				<text v-else-if="isSelect && selectNum !== 0">已选 {{selectNum}} 项</text>
			</view>
			<view class="nav-right">
				<view v-if="fileList.length !== 0">
					<text v-if="!isSelect" @click="selectFile">选择</text>
					<text v-else @click="allSelect">{{isSelectAll ? '取消全选' : '全选'}}</text>
				</view>
			</view>
		</view>
		<view class="content">
			<CollectionItem
				v-for="(item,index) in fileList"
				:isCollection="1"
				:key="item.id"
				:fileItem="item"
				:isSelect="isSelect"
				:videoList="videoList"
				@fileItemClick="fileItemClick"
				@detailClick="detailClick"
			/>
		</view>
		
		<!-- 选择文件的底部 nav -->
		<SelectBottomNav
		:isCollection="1"
		:isSelect="isSelect"
		:selectNum="selectNum"
		@favoritesClick="favoritesClick"
		@cancelFavoritesClick="cancelFavoritesClick"
		@deleteCollect="deleteCollect"
		/>
		
		<!-- 音频弹出层 -->
		<ming-pop ref="musicpop" direction="center" :is_close="false" :is_mask="true" :width="100">
			<!--@maskClick="musicMaskClick" <zaudio theme="theme1" themeColor="#42b983"></zaudio> -->
			<audio :src="audioObj.src" poster="/static/img/music.png" :name="audioObj.name" controls></audio>
		</ming-pop>
		<!-- 视频弹出层 -->
		<ming-pop class="videopop" ref="videopop" direction="center" :is_close="false" :is_mask="true" :width="100">
			<video class="video" :src="videoSrc" controls></video>
		</ming-pop>
		<!-- 查看文件详情弹出层 -->
		<FilePop 
			ref="FilePops" 
			:fileObject="fileObject"
			:videoList="videoList"
			@renameClick="renameClick"
			@detailsClick="detailsClick"
			@favoritesClick="favoritesClick"
			@cancelFavoritesClick="cancelFavoritesClick"
			@deletefile="deletefile"
			@selectFileClick="selectFile"
			@downloadFile="downloadFile"
			@shareClick="shareClick"
		/>
		<!-- 重命名弹出层 -->
		<RenamePop
		ref="RenamePops"
		:renameFile="renameFile"
		:videoList="videoList"
		@done="done"
		/>
		<!-- 详细信息弹出框 -->
		<FileDetailPop ref="FileDetailPops" :fileObject="fileObject"></FileDetailPop>
		<!-- 消息提示框 -->
		<quick-message ref="message"></quick-message>
	</view>
</template>

<script>
// 引入混入的文件
import {mixin} from '../../utils/mixin.js'

export default {
  name: 'collection',
	mixins: [mixin],
  props: {},
  data() {
    return {
			
    };
  },
	onLoad() {},
	mounted() {
		this.getFileInfo()
	},
	computed: {},
  methods: {
		async getFileInfo() {
			const { data } = await this.$myRequest({
				url: `/educenter/file/getAllFileInfo/${this.userInfo.id}`,
				method: 'GET'
			});
			let list = data.data.fileList
			// 筛选出收藏的文件
			let collectList = list.filter((item) => {
				return item.collection === 1
			})
			
			/**
			 * 遍历 list 每一项, 并添加 checked 属性
			 */ 
			// 清空 this.fileList
			this.fileList.splice(0, this.fileList.length)
			// 遍历 collectList 每一项, 并添加 checked 属性
			collectList.map((item, index) => {
				// Object.assign方法用于对象的合并 将后面参数合并到 第一个参数{}
				this.fileList.push(Object.assign({}, item, {checked: false}))
			})
			/**
			 * 获取video显示封面
			 */
			// 筛选出video的数组
			let videolists = list.filter((item) => item.filetype === 'video')
			let videoIdList = []
			videolists.forEach(item => {
				videoIdList.push(item.videoId)
			})
			// 遍历获取 videoId 用于显示第一帧
			if(videoIdList.length > 0) {
				const videodata = await this.$myRequest({
					url: `/eduoss/fileoss/getPlayAuth?isList=${videoIdList}`,
					method: 'post'
				})
				// console.log(videodata)
				this.videoList = videodata.data.data.urlList
			}
			
			// console.log(this.fileList)
		},
		
		back() {
			uni.navigateBack({
			  delta: 2
			});
		}
	}
}
</script>
<style lang='scss' scoped>
.nav {
	display: flex;
	align-items: center;
	height: 100rpx;
	margin-top: 50rpx;
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
		flex: 2;
		font-size: 30rpx;
		color: #333333;
		text-align: right;
	}
}

.content {
	padding: 0 30rpx;
}

/* 视频弹窗的样式 */
.videopop {
	/deep/ .product-window {
		display: flex;
		justify-content: center;
	}
}

</style>