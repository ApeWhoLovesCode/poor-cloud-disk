<template>
  <view class='TransmissionPop'>
		<ming-pop class="chuanshupop" ref="chuanshupop" direction="below" :is_close="true" :is_mask="true" :width="100">
			<view class="title">添加至云盘</view>
			<view class="chuanshu-wrap">
				<view class="chuanshu-item" @click="photoClick">
					<image src="/static/img/photo2.png" mode="scaleToFill"></image>
					<text>本地图片</text>
				</view>
				<view class="chuanshu-item" @click="videoClick">
					<image src="/static/img/video.png" mode="scaleToFill"></image>
					<text>本地视频</text>
				</view>
				<view class="chuanshu-item" @click="takePicturesClick">
					<image src="/static/img/camera.png" mode="scaleToFill"></image>
					<text>拍照上传</text>
				</view>
				<view class="chuanshu-item" @click="localfileClick">
					<image src="/static/img/document3.png" mode="scaleToFill"></image>
					<text>本地文件</text>
				</view>
				<view class="chuanshu-item" @click="newFolderClick">
					<image src="/static/img/folder4.png" mode="scaleToFill"></image>
					<text>新建文件夹</text>
				</view>
			</view>
		</ming-pop>
	</view>
</template>

<script>
import {mapState} from 'vuex'
	
export default {
  name: 'TransmissionPop',
  props: {
		currentDir: {
			type: String,
			required: true
		}
	},
  data() {
    return {
			photoUrl: []
    };
  },
  computed: {
		// 映射 vuex 中的 userInfo
		...mapState(['userInfo','progress','nowProgress', 'totalProgress', 'transmissionImg'])
	},
  watch: {},
  created() {},
  methods: {
		popShow() {
			this.$refs.chuanshupop.show()
		},
		popClose() {
			this.$refs.chuanshupop.close()
		},
		// 点击了本地图片
		photoClick() {
			uni.showActionSheet({
				// original 原图，compressed 压缩图
				itemList: ['原图', '压缩图'],
				success: (item) => {
					let sizeType = []
					if(item.tapIndex == 0) {
						sizeType.push("original")
					} else {
						sizeType.push("compressed")
					}
					uni.chooseImage({
						count: 1,
						sizeType,
						sourceType: ['album'], //从相册选择
						success: (res) => {
							// 保存从相册选择的图片的 blod 路径
							let filePath = res.tempFilePaths[0]
							// 向父组件发送 图片地址
							this.$store.commit('setTransmissionImg', filePath)
							// 网络请求
							this.networkUpload(filePath)
						}
					})
				}
			})
			
		},
		// 本地视频
		videoClick() {
			uni.chooseVideo({
				success: (res) => {
					const filePath = res.tempFilePath
					// 网络请求
					this.networkUpload(filePath)
				}
			})
		},
		// 拍照上传
		takePicturesClick() {
			uni.chooseImage({
				count: 1,
				sourceType: ['camera'],	// 使用相机
				success: (res) => {
					// 保存从相册选择的图片的 blod 路径
					const filePath = res.tempFilePaths[0]
					// 网络请求
					this.networkUpload(filePath)
				}
			})
		},
		// 本地文件
		localfileClick() {
			uni.showToast({
				title: 'app上传文件出了点问题，请等待后续更新噢',
				icon: 'none',
				duration: 1500,
				position: 'top'
			})
			uni.chooseFile({
				count: 1,
				success: (res) => {
					const filePath = res.tempFilePaths[0]
					// 网络请求
					this.networkUpload(filePath)
				}
			})
		},
		// 暂时没用代码
		// getDirList(){
		//   plus.io.resolveLocalFileSystemURL(
		//     "file:///storage/emulated/0/Documents", //指定的目录
  //       function(entry) {
  //         var directoryReader = entry.createReader(); //获取读取目录对象
  //         directoryReader.readEntries(
  //         function(entries) { //历遍子目录即可
  //           for (var i = 0; i < entries.length; i++) {
  //             console.log("文件信息：" + entries[i].name);
  //           }
  //         },
  //         function(err) {
  //           console.log("访问目录失败",err);
  //         });
		// 		},
  //       function(err) {
  //       console.log("访问指定目录失败:" + err.message);
  //     });
  //   },

		// 新建文件夹
		newFolderClick() {
			this.popClose()
			this.$emit('newFolder')
		},
		/**
		 * 网络请求的方法
		 */
		async networkUpload(filePath) {
			this.popClose()
			/**
			 * 调用接口
			 * 将文件上传到服务器
			 */
			const uploadProgress = uni.uploadFile({
				// url: `/api/eduoss/fileoss/upload/${this.userInfo.id}?catalogue=${this.currentDir}`,
				url: `http://120.79.189.150:8001/eduoss/fileoss/upload/${this.userInfo.id}?catalogue=${this.currentDir}`,
				filePath,
				name: 'file',
				success: async (res) => {
					// 得到的 res.data 是字符串 这里要转化为对象
					let obj = JSON.parse(res.data)
					let fileObj = obj.data.file
					fileObj.memId = this.userInfo.id
					/**
					 * 调用接口
					 * 将服务器中的文件上传到数据库
					 */
					const {data} = await this.$myRequest({
						url: '/educenter/file/addFile',
						method: 'POST',
						data: fileObj
					})
					// console.log(data)
					if(data.code !== 20000) {
						uni.showToast({
							title: '上传文件到数据库失败'
						})
						return
					}
					uni.showToast({
						title: '上传文件成功'
					})
					
					this.$refs.chuanshupop.close()
					this.$emit('transmissionDone')
				},
				fail: (err) => {
					uni.showToast({
						title: '上传文件失败'
					})
				}
			})
			
			let that = this
			// 监听上传进度
			uploadProgress.onProgressUpdate((res) => {
				// vm.$emit('update:父组件属性', 值) 子组件修改父组件的值
				// 父组件 要修改的属性之后加入 .sync
				that.$store.commit('setProgress', res.progress)
				that.$store.commit('setNowProgress', res.totalBytesSent)
				that.$store.commit('setTotalProgress', res.totalBytesExpectedToSend)
				// console.log('上传进度' + res.progress);
				// console.log('已经上传的数据长度' + res.totalBytesSent);
				// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
			})
			
		}
	}
}
</script>
<style lang='scss' scoped>
	.chuanshupop {
		/deep/ .product-window {
			z-index: 999;
		}
		.title {
			font-size: 32rpx;
			color: #000000;
			text-align: center;
			font-weight: 600;
			margin-bottom: 30rpx;
		}
		.chuanshu-wrap {
			display: flex;
			flex-wrap: wrap;
			.chuanshu-item {
				width: 30%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-bottom: 40rpx;
				margin-right: 5%;
				image {
					width: 90rpx;
					height: 80rpx;
					margin-bottom: 20rpx;
				}
				text {
					font-size: 28rpx;
				}
			}
			.chuanshu-item:nth-child(3n) {
				margin-right: 0;
			}
		}
	}
</style>