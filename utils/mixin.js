import {mapState} from 'vuex'

// 混入
export const mixin = {
	// components: {
	// 	zaudio
	// },
	data() {
		return {
			// 当前的文件列表
			fileList: [],
			// 弹出层的文件对象
			fileObject: {},
			// 存放视频的src
			videoList: [],
			// 当前弹出框的 video src
			videoSrc: "",
			// 当前弹出框的 audio src
			audioObj: {
				url: '',
				name: '',
				poster: ''
			},
			// 重命名文件对象
			renameFile: {},
			// 是否选择状态
			isSelect: false,
			// 当前文件夹属于哪个页面
			belongPage: 'all'
		}
	},
	computed: {
		// 映射 vuex 中的 userInfo
		...mapState(['systemBarHeight','userInfo', 'isFileRequest', 'downProgress']),
		// 是否全选了
		isSelectAll() {
			// 找到一个没被选中的, 就是取反变为false  性能好点不用全部遍历
			return !this.fileList.find(item => !item.checked)
		},
		// 筛选出选中的对象
		selectList() {
			let arr = this.fileList.filter(item => {
				if (item.filetype !== 'folder') {
					return item.checked === true
				}
			})
			return arr
		},
		// 选择状态下，选中了多少项
		selectNum() {
			return this.selectList.length
		}
	},
	methods: {
		// 点击了文件详情按钮
		detailClick(fileItem) {
			this.fileObject = fileItem
			// 访问子组件弹出层的显示方法
			this.$refs.FilePops.popshow();
		},
		// 点击了音频弹出框遮罩层
		// musicMaskClick() {
		// 	this.$zaudio.stop()
		// },
		// 点击了文件对象
		fileItemClick(fileItem) {
			const type = fileItem.filetype
			this.typeSelection(fileItem, type)
		},
		/* 不能放到混入 会出问题 */
		// 类型选择
		async typeSelection(fileItem, type) {
			// 点击了文件
			if (type === 'file') {
				uni.downloadFile({
					url: fileItem.url,
					success: function(res) {
						var filePath = res.tempFilePath;
						uni.openDocument({
							filePath: filePath,
							success: function(res) {
								console.log('打开文档成功');
							}
						});
					}
				});
			}
			// 点击了图片
			else if (type === 'image') {
				uni.previewImage({
					urls: [fileItem.url]
				})
			}
			// 点击了音频
			else if (type === 'audio') {
				for (let key in this.audioObj) {
					this.audioObj[key] = ''
				}
				const audiodata = await this.$myRequest({
					url: `/eduoss/fileoss/getPlayAuth?isList=${fileItem.videoId}`,
					method: 'post'
				})

				this.audioObj.src = audiodata.data.data.urlList[0].url
				this.audioObj.name = fileItem.name
				this.$refs.musicpop.show()
				// 音频数据初始化
				/* let data = [
					{
					  src: this.audioSrc,
					  title: "",
					  singer: "",
					  coverImgUrl: "/static/img/music.png",
					}
				];
				this.$zaudio.setAudio(data); //添加音频
				this.$zaudio.setRender(0)//渲染第一首音频 */
			}
			// 点击了视频
			else if (type === 'video') {
				this.videoSrc = ""
				const {data} = await this.$myRequest({
					url: `/eduoss/fileoss/getPlayAuth?isList=${fileItem.videoId}`,
					method: 'post'
				})
				// console.log(data)
				this.$refs.videopop.show()
				this.videoSrc = data.data.urlList[0].url
			}
			// 点击了文件夹
			else {
				let str = fileItem.cdir
				// 1.获取点击的文件的路径 (截取从0到最后一位前的字符串)
				this.currentDir = str.slice(0, str.length - 1)
				// 2.找到当前点击进入到哪个文件, 修改当前文件路径结构
				this.currentDirObj = this.folderList.find((item) => item.name === fileItem.name + '/')
				// 3.保存当前所处的目录id
				this.currentDirId = this.currentDirObj.id
				// 4.保存当前所处文件夹的名字
				this.currentFolderName = this.currentDirObj.name.slice(0, this.currentDirObj.name.length - 1)
				
				// 搜索页面只需重新请求文件夹列表
				if(this.belongPage === 'search') {
					this.getCurrentFile()
				} else {
					this.getFileInfo()
				}
			}
		},

		// 点击了分享
		async shareClick(file) {
			let type =file.filetype
			if(type === 'image') {
				uni.downloadFile({
					url: file.url,
					success: (res) => {
						// 调用系统分享组件发送分享消息，不需要配置分享SDK
						uni.shareWithSystem({
							type: 'image',
							imageUrl: res.tempFilePath
						})
					}
				})
			} else if (type === 'audio') {
				const {data} = await this.$myRequest({
					url: `/eduoss/fileoss/getPlayAuth?isList=${file.videoId}`,
					method: 'post'
				})
				let url = data.data.urlList[0].url
				let shareText = '小破盘-分享-音乐->“' + file.name + '”链接: ' + url 
				uni.shareWithSystem({
					type: 'text',
					summary: shareText
				})
				// uni.share({
				// 	provider: "weixin",
				// 	scene: "WXSceneSession",
				// 	type: 4,
				// 	title: 'space-分享-音乐',
				// 	summary: file.name,
				// 	mediaUrl: url
				// })
			} else if (type === 'video') {
				const {data} = await this.$myRequest({
					url: `/eduoss/fileoss/getPlayAuth?isList=${file.videoId}`,
					method: 'post'
				})
				let url = data.data.urlList[0].url
				let shareText = '小破盘-分享-视频->“' + file.name + '”链接: ' + url
				uni.shareWithSystem({
					type: 'text',
					summary: shareText
				})
				// uni.share({
				// 	provider: "weixin",
				// 	scene: "WXSceneSession",
				// 	type: 4,
				// 	title: 'space-分享-视频',
				// 	summary: file.name,
				// 	mediaUrl: url
				// })
			} else {
				let url = file.url
				let shareText = '小破盘-分享-文件->链接（请使用浏览器打开）: ' + url
				uni.shareWithSystem({
					type: 'text',
					summary: shareText
				})
				// uni.share({
				// 	provider: "weixin",
				// 	scene: "WXSceneSession",
				// 	type: 0,
				// 	title: 'space-分享-文件',
				// 	summary: file.name,
				// 	href: file.url,
				// 	imageUrl: '/static/img/document4.png'
				// })
			}
			
		},
		// 点击了重命名
		renameClick(file) {
			// 这里要深克隆，否则更改名字的时候会修改到原数据
			this.renameFile = this.$lodash.cloneDeep(file)
			this.$refs.FilePops.popclose()
			this.$refs.RenamePops.popshow()
		},
		// 重命名完成
		async done(file) {
			if(file.filetype === 'folder') {
				let url = file.cdir.substring(0, file.cdir.length - 1)
				const {data} = await this.$myRequest({
					url: `/educenter/dir/updateDirStruct/${this.userInfo.id}/${file.name}/${file.id}`,
					method: 'POST',
					data: url
				})
				// 重新获取文件列表
				this.newFolderDone()
			}
			else {
				const {data} = await this.$myRequest({
					url: `/educenter/file/updateFile/${file.id}/${file.name}`,
					method: 'POST'
				})
				this.ifOperation(data)
			}
			
		},
		// 点击了下载文件
		downloadFile(file) {
			let type = file.filetype
			// 点击了图片
			if (type === 'image') {
				const downloadTask = uni.downloadFile({
					url: file.url,
					success: (res) => {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
						})
						uni.showToast({
							title: '保存图片成功',
							duration: 1000
						})
					}
				})
				let that = this
				downloadTask.onProgressUpdate((res) => {
					that.$store.commit('setDownProgress', res.progress)
					that.$store.commit('setDownNowProgress', res.totalBytesWritten)
					that.$store.commit('setDownTotalProgress', res.totalBytesExpectedToWrite)
				});
			}
			// 点击了视频
			else if (type === 'video') {
				let arr = this.videoList.find((item) => item.videoId === file.videoId)
				const downloadTask = uni.downloadFile({
					url: arr.url,
					success: (res) => {
						uni.saveVideoToPhotosAlbum({
							filePath: res.tempFilePath
						})
						uni.showToast({
							title: '保存到相册成功',
							duration: 1000
						})
					}
				})
				let that = this
				downloadTask.onProgressUpdate((res) => {
					that.$store.commit('setDownProgress', res.progress)
					that.$store.commit('setDownNowProgress', res.totalBytesWritten)
					that.$store.commit('setDownTotalProgress', res.totalBytesExpectedToWrite)
				});
			}
			// 点击了音频
			else if (type === 'audio') {
				uni.showModal({
					title: '默认保存路径：手机根目录/aspace/',
					success: async (res) => {
						if (res.confirm) {
							const audiodata = await this.$myRequest({
								url: `/eduoss/fileoss/getPlayAuth?isList=${file.videoId}`,
								method: 'post'
							})
							let url = audiodata.data.data.urlList[0].url
							let name = file.name + file.type
							this.savePhoneLocal(url, name)
						} else if (res.cancel) {
							return
						}
					}
				})
			}
			// 点击了文件
			else {
				uni.showModal({
					title: '默认保存路径：手机根目录/aspace/',
					success: (res) => {
						if (res.confirm) {
							let url = file.url
							// 截取 url 最后一个 / 后面的文件名
							let index = url.lastIndexOf('/')
							let name = url.substring(index + 1, url.length)
							this.savePhoneLocal(url, name)
						} else if (res.cancel) {
							return
						}
					}
				})
			}

			this.$refs.FilePops.popclose()

		},
		// 保存到手机aspace文件夹的方法
		savePhoneLocal(url, name) {
			let dtask = plus.downloader.createDownload(url, {
				//本地路径开头使用file://，跟上手机文件本地目录storage/emulated/0，就是用户文件管理器能看到的了，之后我创建微垠作为文件夹，后缀是用于文件命名和格式修改，大家可以使用变量。
				filename: "file://storage/emulated/0/aspace/" + name //利用保存路径，实现下载文件的重命名
			}, (d, status) => {
				if(status == 200) {
					uni.showToast({
						title: '保存文件成功',
						duration: 1000
					})
				} else {
					uni.showToast({
						title: '保存文件失败',
						duration: 1000
					})
				}
			})
			dtask.start();
			
		},
		// 点击了查看详细信息
		detailsClick() {
			this.$refs.FilePops.popclose()
			this.$refs.FileDetailPops.popshow()
		},
		// 点击了选择文件
		selectFile(fileId) {
			// 将该文件变为选中状态
			this.fileList.forEach(item => {
				if (item.id === fileId) {
					item.checked = true
				}
			})
			this.$refs.FilePops.popclose()
			this.isSelect = true
		},

		// 点击了收藏
		async favoritesClick(id) {
			let fileId = []
			// 单选
			if (id !== 'many') {
				fileId.push(id)
			}
			// 多选
			else {
				this.selectList.map(item => {
					fileId.push(item.id)
				})
				this.cancelSelect()
			}
			const {data} = await this.$myRequest({
				url: `/educenter/file/collectFile?id=${fileId}`,
				method: 'post'
			})
			this.$refs.FilePops.popclose()
			this.ifOperation(data)
		},
		// 点击了取消收藏
		async cancelFavoritesClick(id) {
			let fileId = []
			// 单选
			if (id !== 'many') {
				fileId.push(id)
			}
			// 多选
			else {
				this.selectList.map(item => {
					fileId.push(item.id)
				})
				this.cancelSelect()
			}
			const {data} = await this.$myRequest({
				url: `/educenter/file/cancelCollection?id=${fileId}`,
				method: 'post'
			})
			this.$refs.FilePops.popclose()
			this.ifOperation(data)

		},
		// 点击了删除文件
		deletefile(fileItem) {
			this.$refs.FilePops.popclose()
			uni.showModal({
				content: '删除文件（可在回收站中找回已删除文件）',
				cancelColor: '#ee3a46',
				confirmText: '放入回收站',
				confirmColor: '#108cff',
				success: async (res) => {
					let fileArr = []
					fileArr.push(fileItem.id)
					// 点击了确定
					if (res.confirm) {
						if(fileItem.filetype === 'folder') {
							let dir = fileItem.cdir.substring(0, fileItem.cdir.length - 1)
							const {data} = await this.$myRequest({
								url: `/educenter/dir/deleteDirStruct/${this.userInfo.id}/${fileItem.id}`,
								method: 'POST',
								data: dir
							})
							// 重新获取路径
							this.newFolderDone()
						}
						else {
							const {data} = await this.$myRequest({
								url: `/eduoss/fileoss/removeAlyVideo/${this.userInfo.id}?idList=${fileItem.id}`,
								method: 'DELETE'
							})
							// 更新内存数据
							const romdata = await this.$myRequest({
								url: `/educenter/member/getMemberInfo/${this.userInfo.id}`
							})
							this.$store.commit('setUserInfo', romdata.data.data.member)
							this.ifOperation(data)
						}
					}
					// 点击了取消
					else if (res.cancel) {
						return
					}
				}
			})

		},

		// 删除多个文件
		deleteCollect() {
			uni.showModal({
				content: '删除文件（可在回收站中找回已删除文件）',
				cancelColor: '#ee3a46',
				confirmText: '放入回收站',
				confirmColor: '#108cff',
				success: async (res) => {
					// 点击了确定
					if (res.confirm) {
						this.isSelect = false
						let arr = []
						this.selectList.forEach((item, index) => {
							arr.push(item.id)
						})
						const {data} = await this.$myRequest({
							url: `/eduoss/fileoss/removeAlyVideo/${this.userInfo.id}?idList=${arr}`,
							method: 'DELETE'
						})
						// 更新内存数据
						const romdata = await this.$myRequest({
							url: `/educenter/member/getMemberInfo/${this.userInfo.id}`
						})
						this.$store.commit('setUserInfo', romdata.data.data.member)
						this.ifOperation(data)
					}
					// 点击了取消
					else if (res.cancel) {
						return
					}
				}
			})

			// 告诉 file 页面要重新请求数据
			// this.$store.commit('setFileRequest', true)
		},

		// 全选
		allSelect() {
			if (this.isSelectAll) {
				this.fileList.forEach((item) => {
					if (item.filetype !== 'folder') {
						item.checked = false
					}
				})
			} else {
				this.fileList.forEach((item) => {
					if (item.filetype !== 'folder') {
						item.checked = true
					}
				})
			}
		},
		// 取消选择
		cancelSelect() {
			this.fileList.forEach((item) => {
				if (item.filetype !== 'folder') {
					item.checked = false
				}
			})
			this.isSelect = false
		},

		// 判断操作是否成功 并重新请求数据
		async ifOperation(data) {
			if (data.code !== 20000) {
				this.$refs.message.show({
					type: 'error',
					msg: '操作失败',
					time: '1000'
				})
				return
			}
			this.$refs.message.show({
				type: 'success',
				msg: '操作成功',
				time: '1000'
			})
			// 告诉 file 页面要重新请求数据
			this.$store.commit('setFileRequest', true)
			
			// 搜索页面只需重新请求文件夹列表
			if(this.belongPage === 'search') {
				this.getCurrentFile()
			} else {
				this.getFileInfo()
			}
		}
	}
}

// 混入有文件夹的内容
export const mixinFolder = {
	data() {
		return {
			// 用户目录结构
			memDir: {},
			// 当前所处的目录
			currentDir: "/root",
			// 当前所处的目录id
			currentDirId: 1,
			// 当前所处的目录结构
			currentDirObj: {},
			// 文件夹结构列表
			folderList: [],
			// 文件夹列表
			folderContentList: [],
			// 当前所处文件夹的名字
			currentFolderName: ""
		}
	},
	methods: {
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
			
			// 搜索页面只需重新请求文件夹列表
			if(this.belongPage === 'search') {
				this.getCurrentFile()
			} else {
				this.getFileInfo()
			}
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
			this.$refs.NewFolderPops.popshow()
		},
		// 完成了文件夹的操作 -> 完成新建文件夹
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
			
			this.ifOperation(dirData.data)
		},
		// 新建文件夹失败
		newFolderFail() {
			this.$refs.message.show({
				type: 'warning',
				msg: '新建文件夹失败, 名字重复',
				time: '1500'
			})
		},
		// 点击了文件移动
		moveFile(fileId) {
			// 点击了单个文件的移动
			if(fileId) {
				// 将该文件变为选中状态
				this.fileList.forEach(item => {
					if(item.id === fileId) {
						item.checked = true
					}
				})
			}
			this.isSelect = false
			this.$refs.FilePops.popclose()
			this.$refs.FileMovePops.popshow()
		},
		// 完成文件移动
		moveSuccess(data) {
			this.newFolderDone()
			if(this.belongPage === 'search') {
				this.inputClear()
			}
		}
	}
}