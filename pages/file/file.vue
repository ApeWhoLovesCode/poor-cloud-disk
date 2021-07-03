<template>
	<view class="file">
		<!-- 顶部导航栏 -->
		<NavBar 
		:isSelect="isSelect"
		:selectNum="selectNum"
		:isCollect="isCollect"
		@clickAvatar="clickAvatar"
		@gongnengClick="gongnengClick"
		@allSelect="allSelect"
		@doneSelect="cancelSelect"
		></NavBar>
		
		<view class="file-wrap" :style="{marginTop: systemBarHeight + 'px'}">
			<!-- 进入文件夹后的返回nav -->
			<view class="not-root-dir" v-show="currentDir !== '/root'">
				<text class="iconfont icon-arrow-left-bold" @click="backParentDir"></text>
				<text class="not-root-dir-name">{{currentFolderName}}</text>
				<text class="not-root-dir-placeholder"></text>
			</view>
			<!-- 正常显示 -->
			<view class="file-content"v-if="!rowDisplay">
				<FileItem
					class="file-item"
					v-for="(item, index) in fileList" 
					:key="index" 
					:fileItem="item"
					:isSelect="isSelect"
					:videoList="videoList"
					@detailClick="detailClick"
					@fileItemClick="fileItemClick"
				/>
			</view>
			
			<!-- 横向显示 -->
			<view class="rowfile-content" v-else>
				<CollectionItem
					v-for="(item,index) in fileList" 
					:key="index"
					:fileItem="item"
					:isSelect="isSelect"
					:videoList="videoList"
					@fileItemClick="fileItemClick"
					@detailClick="detailClick"
					/>
			</view>
			
			<!-- 选择状态下占位，防止被下面的选择 nav 挡住 -->
			<view v-if="isSelect" class="main-placeholder"></view>
		</view>
				
		<!-- navbar 的弹出层 -->
		<!-- 我的设置弹出层 -->
		<MyPop ref="MyPops" @collectionClick="collectionClick"></MyPop>
		<!-- nav功能弹出层 -->
		<NavGongnengPop 
			ref="NavGongnengPops"
			:rowDisplay.sync="rowDisplay"
			@selectFile="selectFile"
			@nameSort="nameSort"
			@creatTimeSort="creatTimeSort"
			@updateTimeSort="updateTimeSort"
			@sizeSort="sizeSort"
			@reverseSort="reverseSort"
		/>
		<!-- 父组件 要修改的属性之后加入 .sync -->
		<!-- navbar 的弹出层 end -->
		
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
			@moveClick="moveFile"
			@selectFileClick="selectFile"
			@downloadFile="downloadFile"
			@shareClick="shareClick"
		/>
		
		<!-- 音频弹出层 -->
		<ming-pop ref="musicpop" direction="center" :is_close="false" :is_mask="true" :width="100">
			<!--@maskClick="musicMaskClick"  <zaudio theme="theme1" themeColor="#42b983"></zaudio> -->
			<audio :src="audioObj.src" poster="/static/img/music.png" :name="audioObj.name" controls></audio>
		</ming-pop>
		<!-- 视频弹出层 -->
		<ming-pop class="videopop" ref="videopop" direction="center" :is_close="false" :is_mask="true" :width="100">
			<video class="video" :src="videoSrc" controls autoplay></video>
		</ming-pop>
		
		<!-- 传输列表弹出层 -->
		<TransmissionPop 
		ref="TransmissionPop" 
		:currentDir="currentDir"
		@newFolder="newFolder"
		@transmissionDone="transmissionDone"
		/>
		<!-- 新建文件夹弹出层 -->
		<NewFolderPop 
		ref="NewFolderPops"
		:currentDir="currentDir"
		:currentDirId="currentDirId"
		@newFolderDone="newFolderDone"
		@newFolderFail="newFolderFail"
		/>
		
		<!-- 重命名弹出层 -->
		<RenamePop 
		ref="RenamePops"
		:renameFile="renameFile"
		:videoList="videoList"
		@done="done"
		/>
		<!-- 详细信息弹出框 -->
		<FileDetailPop 
		ref="FileDetailPops" 
		:fileObject="fileObject"
		:currentDir="currentDir"
		/>
		<!-- 移动文件弹出层 -->
			<!-- v-if="currentDirObj.length!==0 && folderList.length !== 0" -->
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
		
		<!-- 传输列表按钮 -->
		<view
		v-if="!isSelect"
		class="chuanshu-btn" 
		@click="$refs.TransmissionPop.popShow()"
		:class="hideChuanshuBtn ? 'hide-chuanshu' : 'show-chuanshu'"
		>
			<text class="iconfont icon-add"></text>
		</view>
		
		<!-- 选择文件的底部 nav -->
		<SelectBottomNav
		:isSelect="isSelect"
		:selectNum="selectNum"
		:isCollect="isCollect"
		@moveFile="moveFile"
		@favoritesClick="favoritesClick"
		@cancelFavoritesClick="cancelFavoritesClick"
		@deleteCollect="deleteCollect"
		/>
		
	</view>
</template>

<script>
import zaudio from '@/components/uniapp-zaudio/zaudio';
// import zaudio from 'uniapp-zaudio/zaudio'
// 引入混入的文件
import {mixin,mixinFolder} from '../../utils/mixin.js'
import {getItem} from '../../utils/storage.js'

export default {
	name: 'file',
	components: {
		zaudio
	},
	mixins: [mixin,mixinFolder],
	data() {
		return {
			// 所有的文件
			allfileList: [],
			// 隐藏传输按钮
			hideChuanshuBtn: false,
			// 横向显示
			rowDisplay: false
		};
	},
	onLoad() {
		// 当页面加载的时候 如果还没登录 跳转到登录页
		// if(!this.userInfo || !this.userInfo.id) {
		if(!getItem('token')) {
			// 关闭当前页面 跳转到登录页
			uni.redirectTo({
				url: '/pages/login/login'
			})
		}
	},
	onShow() {
		// 在vuex中 用于判断是否需要重新网络请求
		if(this.isFileRequest) {
			this.getUserDir()
			// this.getFileInfo()
			this.$store.commit('setFileRequest', false)
		}
	},
	mounted() {
		this.getUserDir()
		//   const that = this
		// 	var webview = plus.webview.currentWebview();//获取窗口
		// 	plus.key.addEventListener('backbutton', function() {//监听返回事件
		// 	webview.canBack(function(e) {
		// 		if (e.canBack) {
		// 			console.log('返回上一页')
		// 			webview.back(); //返回上一页  
		// 		} else {
		// 			console.log('关闭应用')
		// 			webview.close(); //关闭应用  
		// 		}
		// 	})
		// });
	},
	// 监听页面滚动
	onPageScroll(e) {
		if(e.scrollTop > 100) {
			this.hideChuanshuBtn = true
		} else {
			this.hideChuanshuBtn = false
		}
	},
	// 监听页面下拉刷新
	onPullDownRefresh() {
		this.getUserDir()
	  setTimeout(function () {
	    uni.stopPullDownRefresh();
	  }, 1000);
	},
	computed:{
		// 当前选中的文件 是否为收藏状态
		isCollect() {
			// 从选中的对象中找到有一个还没收藏就返回 false（选中的文件要收藏）
			return !this.selectList.find(item => item.collection === 0)
		}
	},
	watch: {},
	methods: {
		/**
		 * 网络请求
		 */
		//获取当前用户目录结构
		async getUserDir() {
			const dirData = await this.$myRequest({
				url: `/educenter/dir/getUserDir/${this.userInfo.id}`
			})
			// JSON.parse(): 将json字符串转换成json对象。  JSON.stringify():反过来
			this.memDir = JSON.parse(dirData.data.data.dir.memDir)
			this.currentDirObj = JSON.parse(dirData.data.data.dir.memDir)
			this.getFileInfo()
		},
		// 获取当前路径下的所有文件信息
		async getFileInfo() {
			// 清空 this.fileList
			if(this.fileList && this.fileList.length !== 0) {
				this.fileList.splice(0, this.fileList.length)
			}
			const { data } = await this.$myRequest({
				url: `/educenter/file/getCurDirFiles/${this.userInfo.id}`,
				method: 'POST',
				data: this.currentDir
			});
			// console.log(data)
			let list = data.data.files
			
			// 保存当前目录下的文件夹数组
			this.folderList = this.currentDirObj.childrenList
			
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
			
			/**
			 * 遍历 list 每一项, 并添加 checked 属性
			 */ 
			let checkedList = []
			list.forEach((item) => {
				checkedList.push(Object.assign({}, item, {checked: false}))
			})
			// 合并文件夹数组和处理好的文件数组
			this.fileList = this.folderContentList.concat(checkedList)
			// console.log(this.fileList)
			
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
				this.videoList = videodata.data.data.urlList
			}
			
			// 已经请求过数据了，页面重新显示时不用再请求数据
			this.$store.commit('setFileRequest', false)
		},
		
		
		/**
		 * navbar 方法实现模块
		 */
		// 点击了头像
		clickAvatar() {
			this.$refs.MyPops.popshow();
		},
		// 点击了功能 
		gongnengClick() {
			this.$refs.NavGongnengPops.popshow()
		},
		// 按名称排序
		nameSort() {
			let folderList = this.fileList.filter(item => item.filetype === "folder")
			let list = this.fileList.filter(item => item.filetype !== "folder")
			// console.log(list)
			list.sort((obj1, obj2) => {
				if(obj1.filetype !== "folder" && obj1.name < obj2.name) {return -1}
				else if(obj1.filetype !== "folder" && obj1.name > obj2.name) {return 1}
				return 0
			})
			// 数组合并
			this.fileList = folderList.concat(list)
			// console.log(this.fileList)
		},
		// 按创建时间排序
		creatTimeSort() {
			let folderList = this.fileList.filter(item => item.filetype === "folder")
			let list = this.fileList.filter(item => item.filetype !== "folder")
			list.sort((a, b) => {
				// Date.parse() 方法解析一个表示某个日期的字符串，并返回从1970-1-1 00:00:00 UTC 到该日期对象的毫秒数
				return Date.parse(a.gmtCreate) - Date.parse(b.gmtCreate)
			})
			this.fileList = folderList.concat(list)
		},
		// 按修改日期排序
		updateTimeSort() {
			let folderList = this.fileList.filter(item => item.filetype === "folder")
			let list = this.fileList.filter(item => item.filetype !== "folder")
			list.sort((a, b) => {
				return Date.parse(a.gmtModified) - Date.parse(b.gmtModified)
			})
			this.fileList = folderList.concat(list)
		},
		// 按文件大小排序
		sizeSort() {
			this.fileList.sort((obj1, obj2) => {
				return obj1.size - obj2.size
			})
		},
		// 反向排序
		reverseSort() {
			let folderList = this.fileList.filter(item => item.filetype === "folder")
			let list = this.fileList.filter(item => item.filetype !== "folder")
			list.reverse()
			this.fileList = folderList.concat(list)
		},
		
		// 传输完成
		async transmissionDone() {
			this.getFileInfo()
			// 更新内存数据
			const romdata = await this.$myRequest({
				url: `/educenter/member/getMemberInfo/${this.userInfo.id}`
			})
			this.$store.commit('setUserInfo', romdata.data.data.member)
		},
		// 跳转到收藏夹页面
		collectionClick() {
			uni.navigateTo({
				url: '/pages/collection/collection'
			})
		}
		
	}
};
</script>

<style lang="scss" scoped>
.audio-box {
	width: 300rpx;
	height: 300rpx;
	background-color: pink;
	margin-bottom: 300rpx;
}
.file-wrap {
	padding-top: 100rpx;
}
.main-placeholder {
	height: 150rpx;
}
.not-root-dir {
	display: flex;
	align-items: center;
	font-size: 30rpx;
	margin-top: 30rpx;
	padding-bottom: 30rpx;
	text {
		font-size: 32rpx;
		font-weight: bold;
		color: #000000;
	}
	.iconfont {
		width: 100rpx;
		font-size: 45rpx;
		color: #333333;
		font-weight: 400;
		text-align: center;
	}
	.not-root-dir-name {
		flex: 1;
		text-align: center;
	}
	.not-root-dir-placeholder {
		width: 100rpx;
	}
}
.file-content {
	display: flex;
	flex-wrap: wrap;
	padding: 0 2% 0;
	.file-item {
		box-sizing: border-box;
		width: 30%;
		margin-right: 5%;
		margin-bottom: 40rpx;
	}
	.file-item:nth-child(3n) {
		margin-right: 0;
	}
}

.rowfile-content {
	padding: 5rpx 30rpx;
}

/* 视频弹窗的样式 */
.videopop {
	/deep/ .product-window {
		display: flex;
		justify-content: center;
	}
}

/* 传输按钮 */
.chuanshu-btn {
	position: fixed;
	right: 0rpx;
	bottom: 120rpx;
	width: 100rpx;
	height: 100rpx;
	line-height: 100rpx;
	text-align: center;
	// background: linear-gradient(to right, #8e2de2, #4b00ef);
	background: linear-gradient(to right, #8c9eff, #4b00ef);
	border-radius: 50%;
	box-shadow: 2rpx 12rpx 20rpx #d1d1d2;
	.icon-add {
		font-size: 50rpx;
		color: #FFFFFF;
	}
}

// 定义动画
@keyframes hide {
	0% {
		transform: translateX(-50rpx);
	}
	100% {
		transform: translateX(90rpx);
		width: 20rpx;
		height: 20rpx;
	}
}
@keyframes show {
	0% {
		transform: translateX(90rpx);
		width: 20rpx;
		height: 20rpx;
	}
	100% {
		transform: translateX(-50rpx);
		width: 100rpx;
		height: 100rpx;
	}
}

/* 传输按钮的新类名 */
.hide-chuanshu {
	/* animation: 动画名称 持续时间 运动曲线 何时开始 播放次数 是否反方向 动画结束的始末状态;
	animation: name duration timing-function delay iteration-count direction fill-mode;
	前两个属性:name duration 一定要写 其他可以省略
	ease-out:低速结束; forwards:在动画结束后将应用该属性值 */
	animation: hide 0.5s ease-out forwards;
}
.show-chuanshu {
	animation: show 0.5s ease-out forwards;
}
</style>
