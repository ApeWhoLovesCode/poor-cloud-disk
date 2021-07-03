<script>
	/*每个页面公共css */
	// import "./static/font/iconfont.css"
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 页面初始化完成时，获取手机系统栏的高度
			uni.getSystemInfo({
				success: res => {
					this.$store.commit('setSystemBarHeight', res.statusBarHeight);
				}
			});
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("./static/icon/iconfont.ttf");
</style>
