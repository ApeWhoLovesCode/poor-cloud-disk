<template>
  <view class='search'>
		<view class="search-head" :style="{paddingTop: systemBarHeight + 'px'}">
			<view class="search-input">
				<text class="search-icon iconfont icon-search"></text>
				<input 
				class="search-inp" 
				type="text" 
				placeholder="搜索云盘的所有内容"
				focus
				:value="searchContent" 
				confirm-type="search"
				@confirm="getFileInfo"
				@input="inputChange"
				/>
				<text v-if="searchContent" class="iconfont icon-close" @click="inputClear"></text>
			</view>
			<view class="channel" @click="back()">取消</view>
		</view>
		<!-- 搜索分类推荐 -->
		<view v-if="searchContent.length === 0 && !haveResult" class="search-main" @click="Undeveloped" :style="{marginTop: (systemBarHeight + 50) + 'px'}">
			<view class="s-m-item">
				<text class="iconfont icon-tupian"></text>
				<text>图片</text>
			</view>
			<view class="s-m-item">
				<text class="iconfont icon-changyongtubiao-fuben-45"></text>
				<text>文件夹</text>
			</view>
			<view class="s-m-item">
				<text class="iconfont icon-wenjian"></text>
				<text>文档</text>
			</view>
			<view class="s-m-item">
				<text class="iconfont icon-customer-service"></text>
				<text>音频</text>
			</view>
		</view>
		<view v-if="haveResult" class="search-content" :style="{marginTop: (systemBarHeight + 50) + 'px'}">
			<!-- 进入文件夹后的返回nav -->
			<view class="not-root-dir" v-if="currentDir !== '/root'">
				<text class="iconfont icon-arrow-left-bold" @click="backParentDir"></text>
				<text class="not-root-dir-name">{{currentFolderName}}</text>
				<text class="not-root-dir-placeholder"></text>
			</view>
			<view class="s-c-title">文件名包含{{searchContent}} <text>{{fileList.length}}</text></view>
			<view class="s-c-main">
				<CollectionItem
					v-for="(item,index) in fileList" 
					:key="index"
					:fileItem="item"
					:videoList="videoList"
					@fileItemClick="fileItemClick"
					@detailClick="detailClick"
					/>
			</view>
		</view>
		<!-- v-if="(!haveResult) && (searchContent.length !== 0)"  -->
		<view v-if="!haveResult && searchContent.length !== 0" class="not-search" :style="{marginTop: (systemBarHeight + 50) + 'px'}">
			云盘中没有找到包含“{{searchContent}}”的内容
		</view>
		
		<!-- 弹出层 -->
		<!-- 音频弹出层 -->
		<ming-pop ref="musicpop" direction="center" :is_close="false" :is_mask="true" :width="100">
			<!--@maskClick="musicMaskClick" <zaudio theme="theme1" themeColor="#42b983"></zaudio> -->
			<audio :src="audioObj.src" poster="/static/img/music.png" :name="audioObj.name" controls></audio>
		</ming-pop>
		<!-- 视频弹出层 -->
		<ming-pop class="videopop" ref="videopop" direction="center" :is_close="false" :is_mask="true" :width="100">
			<video class="video" :src="videoSrc" controls></video>
		</ming-pop>
		<FilePop
			ref="FilePops"
			:parentType="'search'"
			:fileObject="fileObject"
			:videoList="videoList"
			@renameClick="renameClick"
			@detailsClick="detailsClick"
			@favoritesClick="favoritesClick"
			@cancelFavoritesClick="cancelFavoritesClick"
			@deletefile="deletefile"
			@moveClick="moveFile"
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
		<!-- 移动文件弹出层 -->
		<FileMovePop
			v-if="currentDirObj.length!==0"
			ref="FileMovePops"
			:selectListcopy="selectList"
			:memDircopy="memDir"
			:folderContentListcopy="folderContentList"
			:currentDircopy="currentDir"
			:currentDirObjcopy="currentDirObj"
			:folderListcopy="folderList"
			:currentDirIdcopy="currentDirId"
			:currentFolderNamecopy="currentFolderName"
			@moveSuccess="moveSuccess"
			@newFolder="newFolder"
		/>
		<!-- 消息提示框 -->
		<quick-message ref="message"></quick-message>
	</view>
</template>

<script>
import { debounce } from 'lodash'
import {mapState} from 'vuex'
import {mixin,mixinFolder} from '../../utils/mixin.js'
	
export default {
  name: 'search',
	mixins: [mixin,mixinFolder],
  data() {
    return {
			// 搜索的内容
			searchContent: "",
			// 搜索的文件数组
			fileList: [],
			// 搜索的文件夹数组
			searchFolderList: [],
			// 有搜索到结果
			haveResult: false
    };
  },
  computed: {
		...mapState(['systemBarHeight','userInfo'])
	},
  watch: {
		searchContent: {
			// 第一次组件还没渲染出来 监视不到  解决方法下面
			// 当数据发生变化 触发的函数
			// 防抖处理 输入停顿时间超过 500 ms 才请求
			handler: debounce(function (val) {
				if(val.length !== 0) {
					this.getFileInfo()
				} else {
					this.haveResult = false
				}
			}, 300)
		}
	},
  created() {
		this.getUserDir()
	},
  methods: {
		//获取当前用户目录结构
		async getUserDir() {
			const dirData = await this.$myRequest({
				url: `/educenter/dir/getUserDir/${this.userInfo.id}`
			})
			// JSON.parse(): 将json字符串转换成json对象。  JSON.stringify():反过来
			this.memDir = JSON.parse(dirData.data.data.dir.memDir)
		},
		// 点击搜索
		async getFileInfo() {
			const {data} = await this.$myRequest({
				url: `/educenter/file/findFile/${this.userInfo.id}/${this.searchContent}`,
				method: 'POST'
			})
			if(data.data.fileList.length === 0 && data.data.list.length === 0) {
				this.haveResult = false
				return
			}
			this.haveResult = true
			let fileLists = data.data.fileList
			/**
			 * 遍历 list 每一项, 并添加 checked 属性
			 */ 
			let checkedList = []
			fileLists.forEach((item) => {
				checkedList.push(Object.assign({}, item, {checked: false}))
			})
			// 保存当前的目录结构
			this.currentDirObj = this.memDir
			// 证明有文件夹
			if(data.data.list.length !== 0) {
				// 获取文件夹数据，并合并文件和文件夹数组
				this.getFolder(data.data.list, checkedList)
			} else {
				this.fileList = checkedList
			}
			
		},
		// 获取文件夹列表
		getFolder(dirlist, fileLists) {
			// 保存当前属于的页面，用于后面的点击进入文件夹的判断
			this.belongPage = 'search'
			// 保存当前目录下的文件夹数组
			this.folderList = dirlist
			// 清空 this.folderContentList
			this.folderContentList.splice(0, this.folderContentList.length)
			// 遍历当前目录下的数组，获取文件夹数量
			this.folderList.forEach((item,index) => {
				// 保存文件夹数组
				this.folderContentList.push({
					id: item.id,
					fdir: this.currentDir,
					filetype: "folder",
					name: item.name.slice(0, item.name.length - 1),
					cdir: this.currentDir + '/' + item.name
				})
			})
			// 合并文件夹数组和处理好的文件数组
			this.fileList = this.folderContentList.concat(fileLists)
		},
		// 请求当前目录下的文件
		async getCurrentFile() {
			// 清空 this.fileList
			if(this.fileList && this.fileList.length !== 0) {
				this.fileList.splice(0, this.fileList.length)
			}
			const { data } = await this.$myRequest({
				url: `/educenter/file/getCurDirFiles/${this.userInfo.id}`,
				method: 'POST',
				data: this.currentDir
			});
			let list = data.data.files
			/**
			 * 遍历 list 每一项, 并添加 checked 属性
			 */ 
			let checkedList = []
			list.forEach((item) => {
				checkedList.push(Object.assign({}, item, {checked: false}))
			})
			// 重新获取文件夹数据，并合并文件和文件夹数组
			this.getFolder(this.currentDirObj.childrenList, checkedList)
		},
		inputChange(e) {
			this.searchContent = e.detail.value
		},
		inputClear() {
			this.searchContent = ""
		},
		back() {
			uni.navigateBack({
			  delta: 2
			});
		},
		// 功能未开发
		Undeveloped() {
			uni.showToast({
				title: '该功能尚未开发，敬请期待',
				icon: 'none',
				duration: 1000,
				position: 'top'
			})
		}
	}
}
</script>
<style lang='scss' scoped>
.search-head {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 100rpx;
	padding: 0 30rpx;
	display: flex;
	align-items: center;
	background-color: #FFFFFF;
	z-index: 1;
	.search-input {
		position: relative;
		flex: 8;
		height: 60%;
		display: flex;
		align-items: center;
		border: 2rpx solid #efefef;
		border-radius: 30rpx;
		.search-icon {
			font-size: 40rpx;
			color: #6b6b6b;
			padding: 0 20rpx;
		}
		.search-inp {
			flex: 1;
			color: #999;
			font-size: 30rpx;
		}
		.icon-close {
			position: absolute;
			right: 30rpx;
			top: 13rpx;
			font-size: 26rpx;
			background-color: #a3a3a3;
			color: #FFFFFF;
			border-radius: 50%;
			padding: 5rpx;
		}
	}
	.channel {
		flex: 1;
		padding-left: 25rpx;
		font-size: 30rpx;
		color: #4ccfff;
	}
}

.search-main {
	margin-top: 110rpx;
	.s-m-item {
		display: flex;
		align-items: center;
		padding: 25rpx 30rpx;
		text {
			font-size: 35rpx;
			color: #333333;
		}
		.iconfont {
			font-size: 55rpx;
			margin-right: 30rpx;
		}
	}
}

.search-content {
	margin-top: 100rpx;
	padding: 40rpx 30rpx 0;
	.s-c-title {
		font-size: 30rpx;
		color: #333333;
		text{
			display: inline-block;
			background-color: #858dfe;
			font-size: 22rpx;
			color: #FFFFFF;
			padding: 5rpx 10rpx;
			border-radius: 50%;
			margin-left: 20rpx;
		}
	}
	.s-c-main {
	}
}

.not-search {
	padding-top: 30rpx;
	text-align: center;
	font-size: 30rpx;
	color: #333333;
}

.not-root-dir {
	display: flex;
	align-items: center;
	font-size: 30rpx;
	margin-bottom: 30rpx;
	padding-left: 30rpx;
	text {
		font-size: 32rpx;
		font-weight: bold;
		color: #000000;
	}
	.iconfont {
		width: 40rpx;
		font-size: 40rpx;
		color: #333333;
		font-weight: 400;
	}
	.not-root-dir-name {
		flex: 1;
		text-align: center;
	}
	.not-root-dir-placeholder {
		width: 40rpx;
	}
}

/* 视频弹窗的样式 */
.videopop {
	/deep/ .product-window {
		display: flex;
		justify-content: center;
	}
}
</style>