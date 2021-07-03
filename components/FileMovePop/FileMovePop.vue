<template>
  <view class='FileMovePop'>
		<ming-pop class="pops" ref="FileMovePop" direction="below" :is_close="true" :is_mask="true" :width="100">
			<scroll-view class="scroll-Y" scroll-y="true" >
				<view class="move-wrap">
					<view class="root-dir" v-show="currentDir === '/root'">桌面</view>
					<view class="not-root-dir" v-show="currentDir !== '/root'">
						<text class="iconfont icon-arrow-left-bold" @click="backParentDir"></text>
						<text class="not-root-dir-name">{{currentFolderName}}</text>
						<text class="not-root-dir-placeholder"></text>
					</view>
					<view 
						class="folder-item" 
						v-for="(item,index) in folderContentList" 
						:key="index" 
						@click="folderClick(item)">
						<view class="folder-img">
							<image src="/static/img/folder.png" mode="aspectFill"></image>
						</view>
						<view class="folder-name">{{item.name}}</view>
					</view>
				</view>
			</scroll-view>
			<view class="nav-bottom">
				<view class="new-folder" @click="newFolder">
					<text class="iconfont icon-changyongtubiao-fuben-45"></text>
					<text>新建文件夹</text>
				</view>
				<view class="move" @click="moveThis">移动到此处</view>
			</view>
		</ming-pop>
		<!-- 新建文件夹弹出层 -->
		<NewFolderPop 
		ref="NewFolderPops"
		:currentDir="currentDir"
		:currentDirId="currentDirId"
		@newFolderDone="newFolderDone"
		/>
	</view>
</template>

<script>
import {mapState} from 'vuex'
	
export default {
  name: 'FileMovePop',
  props: {
		selectListcopy: {
			type: Array,
			required: true
		},
		memDircopy: {
			type: Object,
			required: true
		},
		folderContentListcopy: {
			type: Array,
			required: true
		},
		currentDircopy: {
			type: String,
			required: true
		},
		currentDirObjcopy: {
			type: Object,
			required: true
		},
		folderListcopy: {
			type: Array,
			required: true
		},
		currentDirIdcopy: {
			type: Number,
			required: true
		},
		currentFolderNamecopy: {
			type: String,
			required: true
		}
	},
  data() {
    return {
			selectList: this.selectListcopy,
			memDir: this.memDircopy,
			folderContentList: this.folderContentListcopy,
			currentDir: this.currentDircopy,
			currentDirObj: this.currentDirObjcopy,
			folderList: this.folderListcopy,
			currentFolderName: this.currentFolderNamecopy,
			currentDirId: this.currentDirIdcopy
    };
  },
  computed: {
		...mapState(['userInfo'])
	},
  watch: {
		// 监听到 props 的值改变就重新赋值给 data (用于进入新的文件夹里面后移动文件)
		selectListcopy(newValue) {
			this.selectList = newValue
		},
		memDircopy(newValue) {
			this.memDir = newValue
		},
		folderContentListcopy(newValue, oldValue) {
			this.folderContentList = newValue
		},
		currentDircopy(newValue, oldValue) {
			this.currentDir = newValue
		},
		currentDirObjcopy(newVlaue,oldValue) {
			this.currentDirObj = newVlaue
		},
		folderListcopy(newVlaue,oldValue) {
			this.folderList = newVlaue
		},
		currentDirIdcopy(newValue) {
			this.currentDirId = newValue
		},
		currentFolderNamecopy(newValue) {
			this.currentFolderName = newValue
		}
	},
  created() {},
  methods: {
		// 获取文件夹信息
		getFolder() {
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
			// console.log(this.folderContentList)
		},
		// 点击了文件夹
		folderClick(fileItem) {
			let str = fileItem.cdir
			// 1.获取点击的文件的路径 (截取从0到最后一位前的字符串)
			this.currentDir = str.slice(0, str.length - 1)
			// 2.找到当前点击进入到哪个文件, 修改当前文件路径结构
			this.currentDirObj = this.folderList.find((item) => item.name === fileItem.name + '/')
			// 3.保存当前所处的目录id
			this.currentDirId = this.currentDirObj.id
			// 进入文件夹后修改父组件的 currentDirId
			// this.$emit('update:currentDirIdcopy', this.currentDirId)
			// 4.保存当前所处文件夹的名字
			this.currentFolderName = this.currentDirObj.name.slice(0, this.currentDirObj.name.length - 1) 
			
			this.getFolder()
		},
		// 返回父级目录
		backParentDir() {
			// 获取父级目录的id
			let parentId = this.currentDirObj.parentId
			let arr = []
			arr.push(this.memDir)
			
			// 从当前用户的目录结构中 获取父级目录结构
			this.currentDirObj = this.findPathByLeafId(parentId, arr)
			// 保存返回到上一级的目录id
			this.currentDirId = this.currentDirObj.id
			// 保存返回上一级目录的文件夹名字
			this.currentFolderName = this.currentDirObj.name.slice(0, this.currentDirObj.name.length - 1)
			
			// 截取最后一个 / 前面的路径
			let index = this.currentDir.lastIndexOf("/")
			this.currentDir = this.currentDir.slice(0, index)
			
			this.getFolder()
			
		},
		// 递归实现
		// @leafId  查找的id，
		// @nodes   原始Json数据
		// @path    供递归使用
		findPathByLeafId(leafId, nodes, path) {
		  if(path === undefined) {
		    path = [];
		  }
		  for(let i = 0; i < nodes.length; i++) {
				// 用于连接两个或多个数组。
				// 不传参就是最简单的复制一个数组的方法
		    let tmpPath = path.concat();
		    tmpPath.push(nodes[i].id);
				// 如果找到了对应的 id 立刻返回
		    if(leafId == nodes[i].id) {
		       return nodes[i];
		    }
				// 如果还没找到，并且有子节点进入子节点寻找
		    if(nodes[i].childrenList) {
		      let findResult = this.findPathByLeafId(leafId, nodes[i].childrenList, tmpPath);
		      if(findResult) {
		        return findResult;
		      }
		    }
		  }
		},
		// 新建文件夹
		newFolder() {
			// this.$emit('newFolder')
			this.$refs.NewFolderPops.popshow()
		},
		// 完成新建文件夹
		async newFolderDone() {
			const dirData = await this.$myRequest({
				url: `/educenter/dir/getUserDir/${this.userInfo.id}`
			})
			// 重新保存整个目录结构
			this.memDir = JSON.parse(dirData.data.data.dir.memDir)
			
			let parentId = this.currentDirObj.id
			let arr = []
			arr.push(this.memDir)
			// 从当前用户的目录结构中 获取当前目录的结构
			this.currentDirObj = this.findPathByLeafId(parentId, arr)
			this.getFolder()
		},
		// 移动到当前文件夹
		async moveThis() {
			let arr = this.selectList
			let idArr = []
			arr.map(item => {
				idArr.push(item.id)
			})
			const {data} = await this.$myRequest({
				url: `/educenter/file/fileMove?id=${idArr}`,
				method: "POST",
				data: this.currentDir
			})
			// console.log(data)
			
			this.popclose()
			this.$emit('moveSuccess', data)
		},
		
		popshow() {
			this.$refs.FileMovePop.show()
		},
		popclose() {
			this.$refs.FileMovePop.close()
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
.scroll-Y {
	min-height: 800rpx;
	max-height: 1150rpx;
}
.root-dir {
	font-size: 32rpx;		
	font-weight: bold;
	color: #000000;
	text-align: center;
	margin-bottom: 34rpx;
}
.not-root-dir {
	display: flex;
	align-items: center;
	font-size: 30rpx;
	margin-bottom: 30rpx;
	text {
		font-size: 32rpx;
		font-weight: bold;
		color: #000000;
	}
	.iconfont {
		width: 50rpx;
		font-size: 40rpx;
		color: #333333;
		font-weight: 400;
		margin-left: 30rpx;
	}
	.not-root-dir-name {
		flex: 1;
		text-align: center;
	}
	.not-root-dir-placeholder {
		width: 50rpx;
	}
}
.move-wrap {
	.folder-item {
		display: flex;
		align-items: center;
		height: 100rpx;
		margin-bottom: 30rpx;
		border-bottom: 1rpx solid #f1f1f1;
		.folder-img {
			width: 100rpx;
			text-align: center;
			image {
				margin-top: 10rpx;
				width: 90rpx;
				height: 90rpx;
			}
		}
		.folder-name {
			margin-left: 20rpx;
			font-size: 32rpx;
			color: #000000;
		}
	}
	.folder-item:last-child{
		border: 0;
		margin-bottom: 0;
	}
}

.nav-bottom {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 30rpx;
	background-color: #f4f4f4;
	.new-folder {
		font-size: 35rpx;
		color: #6e7bc7;
		.iconfont {
			font-size: 40rpx;
			margin-right: 10rpx;
		}
	}
	.move {
		color: #6e7bc7;
		font-size: 35rpx;
	}
}
</style>