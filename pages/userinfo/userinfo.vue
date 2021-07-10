<template>
	<view class="userinfo" :style="{marginTop: systemBarHeight + 'px'}">
		<view class="userinfo-nav">
			<text class="iconfont icon-arrow-left-bold" @click="back"></text>
			<text class="userinfo-title">编辑个人资料</text>
			<text></text>
		</view>
		<view class="userinfo-edit">
			<view class="userinfo-item userinfo-head" @click="editAvatar">
				<view class="left">个人头像</view>
				<view class="right">
					<view class="right-img"><image :src="avatar" mode="aspectFill"></image></view>
					<text class="iconfont icon-arrow-right"></text>
				</view>
			</view>
			<view class="userinfo-item" @click="popshow">
				<view class="left">昵称</view>
				<view class="right">
					<view class="right-name">{{ userName }}</view>
					<text class="iconfont icon-arrow-right"></text>
				</view>
			</view>
		</view>

		<!-- 昵称弹出层 -->
		<ming-pop class="pops" ref="renamepop" direction="up" :is_close="true" :is_mask="true" :width="100">
			<view class="nav-title">设置昵称</view>
			<view class="name-input">
				<input type="text" :value="userName" @input="inputChange" />
				<text class="iconfont icon-close" @click="inputClear"></text>
			</view>
			<button class="determine" type="default" @click="determine">确定</button>
		</ming-pop>
	</view>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'userinfo',
	props: {},
	data() {
		return {
			avatar: '',
			userName: ''
		};
	},
	computed: {
		...mapState(['systemBarHeight','userInfo'])
	},
	watch: {},
	created() {
		this.getUserInfo();
	},
	methods: {
		async getUserInfo() {
			const { data } = await this.$myRequest({
				url: `/educenter/member/getMemberInfo/${this.userInfo.id}`
			});
			this.avatar = data.data.member.avatar
			this.userName = data.data.member.nickname;
			this.$store.commit('setUserInfo', data.data.member)
		},
		editAvatar() {
			uni.chooseImage({
				count: 1,
				sourceType: ['album'], //从相册选择
				success: res => {
					let filePath = res.tempFilePaths[0];
					// 网络请求
					this.networkUpload(filePath);
				}
			});
		},
		
		// 处理头像的网络请求
		async networkUpload(filePath) {
			uni.uploadFile({
				url: 'http://47.106.217.172:8001/eduoss/fileoss/uploadFileAvatar',
				// url: '/api/eduoss/fileoss/uploadFileAvatar',
				filePath,
				name: 'file',
				success: (res) => {
					// 得到的 res.data 是字符串 这里要转化为对象
					let obj = JSON.parse(res.data)
					let userInfo = { id: this.userInfo.id, avatar: obj.data.url}
					// 将修改信息上传到数据库
					this.uploadUsetInfo(userInfo)
				},
				fail: err => {
					uni.showToast({
						title: '上传头像失败'
					});
				}
			});
		},
		
		// 输入内容发生改变 给name重新赋值
		inputChange(e) {
			this.userName = e.detail.value;
		},
		popshow() {
			this.$refs.renamepop.show();
		},
		popClose() {
			this.$refs.renamepop.close();
		},
		inputClear() {
			this.userName = '';
		},
		// 点击了确定，修改用户昵称
		determine() {
			this.popClose();
			let userInfo = { id: this.userInfo.id, nickname: this.userName}
			this.uploadUsetInfo(userInfo)
		},
		
		/**
		 * 调用接口
		 * 将服务器中的文件上传到数据库
		 */
		async uploadUsetInfo(userInfo) {
			const {data} = await this.$myRequest({
				url: '/educenter/member/updateMemberInfo',
				method: 'POST',
				data: userInfo
			})
			if (data.code !== 20000) {
				uni.showToast({
					title: '上传文件到数据库失败'
				});
				return;
			}
			uni.showToast({
				title: '修改信息成功'
			});
			this.getUserInfo()
		},
		
		back() {
			uni.switchTab({
				url: '/pages/file/file'
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.userinfo-nav {
	margin-top: 10rpx;
	display: flex;
	align-items: center;
	text {
		flex: 1;
	}
	.iconfont {
		margin-left: 30rpx;
		font-size: 40rpx;
		color: #333333;
	}
	.userinfo-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #000000;
	}
}
.userinfo-edit {
	margin: 80rpx 60rpx;
	.userinfo-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 60rpx;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #eaeaea;
		.left {
			font-size: 30rpx;
			color: #333333;
		}
		.right {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 165rpx;
			height: 100%;
			.right-img {
				display: inline-block;
				width: 110rpx;
				height: 100%;
				border-radius: 20rpx;
				overflow: hidden;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.right-name {
				width: 90rpx;
				margin-left: 20rpx;
				font-size: 28rpx;
				color: #999999;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}
			text {
				font-size: 35rpx;
				color: #333333;
			}
		}
	}
	.userinfo-item:last-child {
		border: 0;
	}
	.userinfo-head {
		height: 110rpx;
	}
}
.nav-title {
	text-align: center;
	font-size: 32rpx;
	color: #333333;
	margin-bottom: 30rpx;
}
.name-input {
	position: relative;
	display: flex;
	justify-content: center;
	margin-bottom: 40rpx;
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
		color: #ffffff;
		border-radius: 50%;
		padding: 5rpx;
	}
}
.determine {
	width: 300rpx;
	background: linear-gradient(to right, #8c9eff, #6c51ef);
	font-size: 35rpx;
	color: #ffffff;
	border-radius: 50rpx;
}
</style>
