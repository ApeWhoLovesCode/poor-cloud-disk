<template>
	<view class="photo">
		<NavBar @clickAvatar="clickAvatar" @gongnengClick="gongnengClick"></NavBar>
		<!-- 本机备份 -->
		<view class="backup" :style="{marginTop: (systemBarHeight + 60) + 'px'}" @click="Undeveloped">
			<view class="backup-title">本机备份</view>
			<view class="backup-img">
				<view class="backup-img-item"><image src="/static/img/yasuo.png" mode="aspectFill"></image></view>
				<view class="backup-img-item"><image src="/static/img/yasuo.png" mode="aspectFill"></image></view>
				<view class="backup-img-item"><image src="/static/img/yasuo.png" mode="aspectFill"></image></view>
				<view class="backup-go"><text class="iconfont icon-arrow-right"></text></view>
			</view>
		</view>
		<view class="photo-title">
			<view class="backed-up">云端图片</view>
			<view class="photoNumber">{{photoLength}}</view>
		</view>
		<view class="photo-content" v-for="(thatDay, index) in photoList">
			<view class="photo-time">{{ photoTime(thatDay) }}</view>
			<view class="photo-wrap">
				<view class="photo-item" v-for="(item2, index2) in thatDay" :key="index2" @click="previewImage(index, index2)">
					<image :src="item2.url" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<!-- 我的设置弹出层 -->
		<MyPop ref="MyPops" @collectionClick="collectionClick"></MyPop>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import {getItem} from '../../utils/storage.js'

export default {
	name: 'photo',
	props: {},
	data() {
		return {
			// 保存所有的图片
			allPhotoList: [],
			// 保存相册的图片数组
			photoList: [],
			// 保存相册的图片索引 结构
			photoIndexArr: [],
			// 保存当前相册的图片数量
			photoLength: 0
		};
	},
	computed: {
		// 映射 vuex 中的 userInfo
		...mapState(['systemBarHeight','userInfo', 'isFileRequest']),
		photoTime() {
			return (thatDay) => {
				return thatDay[0].gmtCreate.slice(0, 4) + '年' 
				+ parseInt(thatDay[0].gmtCreate.slice(5, 7)) + '月' 
				+ parseInt(thatDay[0].gmtCreate.slice(8, 10)) + '日'
			}
			
		}
	},
	onLoad() {
		// 当页面加载的时候 如果还没登录 跳转到登录页
		if (getItem('token')) {
			this.getPhoto();
		} else {
			// 关闭当前页面 跳转到登录页
			uni.redirectTo({
				url: '/pages/login/login'
			});
		}
	},
	watch: {},
	created() {},
	methods: {
		/**
		 * 网络请求
		 */
		async getPhoto() {
			const { data } = await this.$myRequest({
				url: `/educenter/file/getAllFileInfo/${this.userInfo.id}`
			});
			// console.log(data)
			let allList = data.data.fileList;
			
			// 筛选出所有的图片
			let allPhoto = allList.filter(item => item.filetype === 'image');
			// console.log(allPhoto);
			
			allPhoto.map(item => {
				this.allPhotoList.unshift(item.url)
			})
			this.photoLength = this.allPhotoList.length
			// 将数组按照每天转化为二维数组
			this.photoList = this.sortArr(allPhoto, 'gmtCreate')
			
		},
		// 传入一个数组
		// 按照特定方式格式化
		sortArr(arr, str) {
			// 二维数组
			let newArr = [],
				// 二维数组的 item
				newArrItem = [],
				// 临时的对照变量
				compareItem;
			let photoIndexArr = [],
				photoIndexArrItem = []
			let photoLength = this.photoLength - 1
			 
			// 按照特定的参数将数组排序将具有相同值得排在一起
			arr = arr.sort(function(a, b) {
				let s = a[str].slice(0, 10),
					t = b[str].slice(0, 10);
				return s < t ? -1 : 1;
			});
		
			if (arr.length) {
				compareItem = arr[0][str].slice(0, 10);
			}
			// 将相同类别的对象添加到统一个数组
			for (let i in arr) {
				// 如果对照项相同 就保存到数组中
				if (arr[i][str].slice(0, 10) === compareItem) {
					newArrItem.unshift(arr[i]);
					photoIndexArrItem.unshift(photoLength)
				} 
				// 如果对照项不相同了，
				// 1.换下一个对照项，
				// 2.将得到的数组存进二维数组中
				// 3.往新的数组中添加一个 新一轮的对象
				else {
					compareItem = arr[i][str].slice(0, 10);
					newArr.unshift(newArrItem);
					newArrItem = [arr[i]];
					
					// 处理图片索引的数组结构
					photoIndexArr.unshift(photoIndexArrItem)
					photoIndexArrItem = []
					photoIndexArrItem.unshift(photoLength)
				}
				photoLength--
			}
			// 将最后的内容保存到新一轮数组中
			newArr.unshift(newArrItem);
			
			photoIndexArr.unshift(photoIndexArrItem)
			this.photoIndexArr = photoIndexArr
			return newArr;
		},
		// 点击了图片
		previewImage(index, index2) {
			let current = this.photoIndexArr[index][index2]
			uni.previewImage({
				current,
				urls: this.allPhotoList
			});
		},
		// 点击了头像
		clickAvatar() {
			this.$refs.MyPops.popshow();
		},
		// 跳转到收藏夹页面
		collectionClick() {
			uni.navigateTo({
				url: '/pages/collection/collection'
			})
		},
		gongnengClick() {
			this.Undeveloped()
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
};
</script>
<style lang="scss" scoped>
.backup {
	padding: 30rpx 25rpx 30rpx;
	margin: 30rpx 20rpx;
	box-shadow: 0 0 8rpx #ccc;
	border-radius: 20rpx;
	.backup-title {
		font-size: 35rpx;
		font-weight: 600;
		color: #000;
		margin-bottom: 20rpx;
	}
	.backup-img {
		display: flex;
		height: 190rpx;
		border-radius: 15rpx;
		overflow: hidden;
		.backup-img-item {
			flex: 2.8;
			margin-right: 5rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.backup-go {
			flex: 1.6;
			display: flex;
			background-color: rgba(0, 0, 0, 0.5);
			align-items: center;
			justify-content: center;
			.iconfont {
				font-size: 50rpx;
				color: #eee;
			}
		}
	}
}

.photo-title {
	display: flex;
	margin: 50rpx 30rpx 20rpx;
	align-items: center;
	.backed-up {
		font-size: 35rpx;
		font-weight: 600;
		color: #000;
	}
	.photoNumber {
		background-color: #858dfe;
		font-size: 24rpx;
		color: #FFFFFF;
		padding: 5rpx;
		border-radius: 50%;
		margin-left: 10rpx;
	}
}

.photo-content {
	margin-top: 30rpx;
	padding: 20rpx 0;
	box-shadow: 0 8rpx 15rpx #f0f0f0;
	.photo-time {
		font-size: 32rpx;
		font-weight: 600;
		color: #000;
		padding-left: 20rpx;
		margin-bottom: 30rpx;
	}
	.photo-wrap {
		display: flex;
		flex-wrap: wrap;
		.photo-item {
			width: 24.625%;
			height: 180rpx;
			margin-right: 0.5%;
			margin-bottom: 5rpx;
			border-radius: 10rpx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.photo-item:nth-child(4n) {
			margin-right: 0;
		}
	}
}
</style>
